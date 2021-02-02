options(java.parameters = c("-XX:+UseConcMarkSweepGC", "-Xmx8192m"))
library(plumber)
library("xlsx")
library(proustr)
library("rjson")
library(jsonlite)
library(tidyverse)
library(tm)
library(ggplot2)
library(tidyr)
library(topicmodels)
library(widyr)
library(tidytext)
library(dplyr)
library(SnowballC)
library(stringr)
library(dplyr)
library("factoextra")
library(cluster)
library(textclean)
library(qdap)
library("textcat")

start.time <- Sys.time()

##count de las palabras, ggplot grafico de las palabras de las mas utilizadas de las de ahora de las palabras limpias
##hacer lo mismo con cada una de las app
##hacer para 1gram y 2gram por separado
##despues decidimos lo del lda

################## Importo el json ################## 

##json_file <-  fromJSON("D:/Escritorio/Uni/Oviedo/TFG/TFG-Server-V1/DataMining/bothStores.json")
json_file <-  fromJSON("D:/Escritorio/Uni/Oviedo/TFG/TFG-Server-V1/DataMining/apps.json")

json_file <- lapply(json_file, function(x) {
  x[sapply(x, is.null)] <- NA
  unlist(x)
})
do.call("rbind", json_file)

################## Creo tidy data frame para description ################## 

app_desc <- tibble(appId = json_file$appId,desc = json_file$description)
tidy_data_frame <- app_desc

tidy_data_frame %>% distinct(appId)

################## Limpio la descripcion ################## 

app_desc <- app_desc[complete.cases(app_desc$appId), ]
not_english_apps <- app_desc[!textcat(app_desc$desc) == "english",]
app_desc <- app_desc[textcat(app_desc$desc) == "english",]

app_desc$desc <- as.character(app_desc$desc)
app_desc$desc <- tm::removeNumbers(app_desc$desc)
app_desc$desc <- tm::removeWords(x = app_desc$desc, c(stopwords(kind = "SMART"),"app", "application"))
app_desc$desc <- str_replace_all(app_desc$desc, pattern = "\\'", " ")
app_desc$desc <- gsub("_", " ", app_desc$desc)
app_desc$desc <- str_replace_all(app_desc$desc, pattern = "[[:punct:]]", " ")
app_desc$desc <- tm::removeWords(x = app_desc$desc, stopwords(kind = "SMART"))
app_desc$desc <- gsub("\\b\\w{1,2}\\s","", app_desc$desc)

for(r in 1:nrow(app_desc)){
  app_desc[r,2] <- replace_url(app_desc[r,2])
}

desc_limpio <- app_desc

################## Creo los tidy text ################## 

print("Creo los tidy text")

## 2grams
app_desc_bigrams <- app_desc %>% 
  unnest_tokens(word, desc, token = "ngrams", n=2) %>%
  anti_join(stop_words)

app_desc_bigrams <- app_desc_bigrams %>%
  separate(word, c("word1", "word2"), sep = " ") %>%
  mutate(word1_stem = wordStem(word1)) %>%
  mutate(word2_stem = wordStem(word2))

app_desc_bigrams <- app_desc_bigrams %>% 
  mutate(word_stem = paste(word1_stem, word2_stem, sep = " "))

drops <- c("word1","word2","word1_stem","word2_stem")
app_desc_bigrams <- app_desc_bigrams[ , !(names(app_desc_bigrams) %in% drops)]

## 1gram
app_desc <- app_desc %>% 
  unnest_tokens(word, desc) %>% 
  anti_join(stop_words) %>%
  mutate(word_stem = wordStem(word)) 

drops <- c("word")
app_desc <- app_desc[ , !(names(app_desc) %in% drops)]

tidy_text <- app_desc
tidy_text_bigram <- app_desc_bigrams

################## Eliminar apps que no interesan ################## 

##2gram
keywords_delete_bigrams <- data.frame(word = c("weight loss", "free trial", "purchase subscription",
                                        "weight lifting", "trial period", 
                                        "lose weight","confirm purchase",
                                        "fat burn", "belly fat", "burn workout",
                                        "apple watch", "heavy weight", "itune account", "slim down",
                                        "burn calories","high intensity", "body sculptor", "for kids"),
                               stringsAsFactors = FALSE)
keywords_delete_bigrams <- keywords_delete_bigrams %>%
  separate(word, c("word1", "word2"), sep = " ") %>%
  mutate(word1_stem = wordStem(word1, language="english")) %>%
  mutate(word2_stem = wordStem(word2, language="english"))
keywords_delete_bigrams <- keywords_delete_bigrams %>% 
  mutate(word_stem = paste(word1_stem, word2_stem, sep = " "))
drops <- c("word1","word2","word1_stem","word2_stem")
keywords_delete_bigrams <- keywords_delete_bigrams[ , !(names(keywords_delete_bigrams) %in% drops)]

vector_apps_bigram <- c()
vector_apps_bigram <- app_desc_bigrams[app_desc_bigrams$word_stem %in% keywords_delete_bigrams, ]
vector_apps_bigram <- unique( vector_apps_bigram$appId )

# for(a in 1:nrow(app_desc_bigrams)){
#   for(k in keywords_delete_bigrams){
#     if(!is.na(app_desc_bigrams[a,2]) & !is.na(as.character(k))){
#       if(app_desc_bigrams[a,2] == k){
#         vector_apps_bigram <- c(vector_apps_bigram,app_desc_bigrams[a,1])
#       }
#     }
#   }
# }

# vector_apps_bigram <- vector_apps_bigram[!duplicated(vector_apps_bigram)]

app_desc <- app_desc[!app_desc$appId %in% vector_apps_bigram,]
app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId %in% vector_apps_bigram,]

# for(c in vector_apps_bigram){
#   app_desc <- app_desc[!app_desc$appId == c,]
#   app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId == c,]
# }

##1gram
keywords_delete  <- wordStem(word = c("ovulation", "fertil", "wearable", "baby", "pregnancy",
                                      "hypnosis", "longevity", "abs", "heavy",
                                      "watches", "trial", "membership", "premium",
                                      "subscription", "meditation", "purchase", "yoga", "pilates",
                                      "zen", "relax", "mind", "eat", "food", "sleep",
                                      "tarot", "slim", "device", "reiky", "weight", "pet", "nutrition",
                                      "calories", "medication", "kids"))

vector_apps <- c()
vector_apps <- app_desc[app_desc$word_stem %in% keywords_delete, ]
vector_apps <- unique( vector_apps$appId )

# vector_apps <- c()
# for(a in 1:nrow(app_desc)){
#   for(k in keywords_delete){
#     if(!is.na(app_desc[a,2]) & !is.na(as.character(k))){
#       if(app_desc[a,2] == k){
#         vector_apps <- c(vector_apps,app_desc[a,1])
#       }
#     }
#   }
# }
# 
# vector_apps <- vector_apps[!duplicated(vector_apps)]

app_desc <- app_desc[!app_desc$appId %in% vector_apps,]
app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId %in% vector_apps,]

app_desc <- app_desc[!is.na(app_desc$appId),] 
app_desc_bigrams <- app_desc_bigrams[!is.na(app_desc_bigrams$appId),] 

# for(c in vector_apps){
#   app_desc <- app_desc[!app_desc$appId == c,]
#   app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId == c,]
# }

toDelete <- vector_apps[!vector_apps%in%vector_apps_bigram]

toAccept_1gram <- app_desc %>% distinct(appId)
toAccept_2gram <- app_desc_bigrams %>% distinct(appId)

toAccept <- toAccept_1gram[!toAccept_1gram%in%toAccept_2gram]

listToApp <- list(as.vector(unlist(toAccept)),as.vector(unlist(toDelete)))
names(listToApp) <- c("accept", "delete")

listToApp


# ################## Creo el Summarized Text ################## 
# 
# print("Creo el Summarized Text")
# 
# ## 1gram
# word_counts <- app_desc %>%
#   count(appId, word_stem, sort = TRUE) %>%
#   ungroup()
# 
# ## 2gram
# word_counts_bigram <- app_desc_bigrams %>%
#   count(appId, word_stem, sort = TRUE) %>%
#   ungroup()
# 
# ## 1gram y 2gram
# all_word_counts <- rbind(word_counts,word_counts_bigram)
# 
# ################## Creo el DocumentTermMatrix ################## 
# 
# print("Creo el DocumentTermMatrix")
# 
# ## 1gram
# desc_dtm <- word_counts %>%
#   cast_dtm(appId, word_stem, n)
# 
# matrizTerms <- as.matrix(desc_dtm)
# 
# ## 2gram
# desc_bigram_dtm <- word_counts_bigram %>%
#   cast_dtm(appId, word_stem, n)
# 
# #matrizBigramTerms <- as.matrix(desc_bigram_dtm)
# 
# ## 1gram y 2gram
# all_dtm <- all_word_counts %>%
#   cast_dtm(appId, word_stem, n)
# 
# ################## Uso tf-idf en summarized text ################## 
# 
# print("Uso tf-idf en summarized text")
# 
# ## 1gram
# desc_tf_idf <- word_counts %>% 
#   bind_tf_idf(word_stem, appId, n)
# 
# total_words <- desc_tf_idf %>% 
#   group_by(appId) %>% 
#   summarize(total = sum(n))
# 
# desc_tf_idf <- left_join(desc_tf_idf, total_words)
# 
# desc_tf_idf <- desc_tf_idf %>%
#   select(-total) %>%
#   arrange(desc(tf_idf))
# 
# ## 2gram
# bigram_tf_idf <- word_counts_bigram %>%
#   bind_tf_idf(word_stem, appId, n) %>%
#   arrange(desc(tf_idf))
# 
# total_words_bigram <- bigram_tf_idf %>% 
#   group_by(appId) %>% 
#   summarize(total = sum(n))
# 
# bigram_tf_idf <- left_join(bigram_tf_idf, total_words)
# 
# bigram_tf_idf <- bigram_tf_idf %>%
#   select(-total) %>%
#   arrange(desc(tf_idf))
# 
# ## 1gram y 2gram
# all_tf_idf <- all_word_counts %>% 
#   bind_tf_idf(word_stem, appId, n)
# 
# total_all_words <- all_tf_idf %>% 
#   group_by(appId) %>% 
#   summarize(total = sum(n))
# 
# all_tf_idf <- left_join(all_tf_idf, total_all_words)
# 
# all_tf_idf <- all_tf_idf %>%
#   select(-total) %>%
#   arrange(desc(tf_idf))
# 
# ################## Pivot_wider() ################## 
# 
# #variables <- c() ##Chequea que las keywords existen en las columnas
# #for(k in keywords){
# #  if(k %in% all_tf_idf$word_stem){
# #    variables <- c(variables, k)
# #  }
# #}
# 
# drops <- c("n","tf","idf")
# all_tf_idf <- all_tf_idf[ , !(names(all_tf_idf) %in% drops)]
# 
# tf_idf_mat <- all_tf_idf %>%
#   pivot_wider(
#     names_from = word_stem,
#     values_from = tf_idf,
#     values_fill = list(tf_idf = 0)
#   )
# 
# tf_idf_mat <- column_to_rownames(tf_idf_mat, 'appId')
# 
# ################## Modelo LDA ################## 
# 
# # Create an LDA model
# desc_lda <- LDA(desc_dtm, k = 3, control = list(seed = 1234)) # k = 2 because we have 2 topics -> health and fitness
# desc_bigram_lda <- LDA(desc_bigram_dtm, k = 3, control = list(seed = 1234))
# both_lda <- LDA(all_dtm, k = 3, control = list(seed = 1234))
# 
# desc_lda2 <- LDA(desc_dtm, k = 2, control = list(seed = 1234)) # k = 2 because we have 2 topics -> health and fitness
# desc_bigram_lda2 <- LDA(desc_bigram_dtm, k = 2, control = list(seed = 1234))
# both_lda2 <- LDA(all_dtm, k = 2, control = list(seed = 1234))
# 
# desc_lda4 <- LDA(desc_dtm, k = 4, control = list(seed = 1234)) # k = 2 because we have 2 topics -> health and fitness
# desc_bigram_lda4 <- LDA(desc_bigram_dtm, k = 4, control = list(seed = 1234))
# both_lda4 <- LDA(all_dtm, k = 4, control = list(seed = 1234))
# 
# # Construct a tidy data frame that summarizes the results of the model
# tidied_model <- tidy(desc_lda)
# bigram_tidied_model <- tidy(desc_bigram_lda)
# both_tidied_model <- tidy(both_lda)
# 
# tidied_model2 <- tidy(desc_lda2)
# bigram_tidied_model2 <- tidy(desc_bigram_lda2)
# both_tidied_model2 <- tidy(both_lda2)
# 
# tidied_model4 <- tidy(desc_lda4)
# bigram_tidied_model4 <- tidy(desc_bigram_lda4)
# both_tidied_model4 <- tidy(both_lda4)
# 
# # What is each topic about? Let's examine the top 10 terms for each topic.
# top_terms <- tidied_model %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_bigram <- bigram_tidied_model %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_bigram %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_both <- both_tidied_model %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_both %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# ##
# top_terms2 <- tidied_model2 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms2 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_bigram2 <- bigram_tidied_model2 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_bigram2 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_both2 <- both_tidied_model2 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_both2 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# ##
# top_terms4 <- tidied_model4 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms4 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_bigram4 <- bigram_tidied_model4 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_bigram4 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# top_terms_both4 <- both_tidied_model4 %>%
#   group_by(topic) %>%
#   top_n(20, beta) %>%
#   ungroup() %>%
#   arrange(topic, -beta)
# 
# top_terms_both4 %>%
#   mutate(term = reorder_within(term, beta, topic)) %>%
#   ggplot(aes(term, beta, fill = factor(topic))) +
#   geom_col(show.legend = FALSE) +
#   facet_wrap(~ topic, scales = "free") +
#   coord_flip() +
#   scale_x_reordered()
# 
# tidied_model_documents <- tidy(desc_lda, matrix = "gamma")
# bigram_tidied_model_documents <- tidy(desc_bigram_lda, matrix = "gamma")
# both_tidied_model_documents <- tidy(both_lda, matrix = "gamma")
# 
# tidied_model_documents2 <- tidy(desc_lda2, matrix = "gamma")
# bigram_tidied_model_documents2 <- tidy(desc_bigram_lda2, matrix = "gamma")
# both_tidied_model_documents2 <- tidy(both_lda2, matrix = "gamma")
# 
# tidied_model_documents4 <- tidy(desc_lda4, matrix = "gamma")
# bigram_tidied_model_documents4 <- tidy(desc_bigram_lda4, matrix = "gamma")
# both_tidied_model_documents4 <- tidy(both_lda4, matrix = "gamma")
# 
# selectedApps <- 
#   tidied_model_documents[tidied_model_documents$topic == 3 & tidied_model_documents$gamma > 0.7, ]
# colnames(selectedApps)[1] <- "appId"
# 
# selectedApps2 <- 
#   tidied_model_documents[tidied_model_documents$gamma > 0.0, ]
# colnames(selectedApps2)[1] <- "appId"
# 
# selectedApps
