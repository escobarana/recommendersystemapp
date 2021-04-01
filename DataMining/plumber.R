#Para que no salte OutOfMemoryError
options(java.parameters = c("-XX:+UseConcMarkSweepGC", "-Xmx8192m"))

library(plumber)
library(rjson)
library(jsonlite)
library(tidyverse)
library(tm)
#library(ggplot2)
library(tidyr)
#library(topicmodels)
library(widyr)
library(tidytext)
library(dplyr)
library(SnowballC)
library(stringr)
#library("factoextra")
#library(cluster)
library(textclean)
#library(qdap)
library("textcat")


#* @apiTitle Data Mining apps

#' @filter cors
cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}



#* Data Mining of apps JSON
#* @param url url where apps json are posted
#* @get /dataMining
#* @json
function(url=""){
  
  print(url)
  
  start.time <- Sys.time()
  
  ################## Importo el json ################## 
  
  json_file <-  fromJSON(url)
  
  ################## Creo tidy data frame para description ################## 
  
  json_file <- lapply(json_file, function(x) {
    x[sapply(x, is.null)] <- NA
    unlist(x)
  })
  do.call("rbind", json_file)
  
  app_desc <- tibble(appId = json_file$appId,desc = json_file$description)
  tidy_data_frame <- app_desc
  
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
  
  print("Eliminar apps que no interesan - 2gram")
  
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
  
  app_desc <- app_desc[!app_desc$appId %in% vector_apps_bigram,]
  app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId %in% vector_apps_bigram,]
  
  print("Eliminar apps que no interesan - 1gram")
  
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
  
  app_desc <- app_desc[!app_desc$appId %in% vector_apps,]
  app_desc_bigrams <- app_desc_bigrams[!app_desc_bigrams$appId %in% vector_apps,]
  
  app_desc <- app_desc[!is.na(app_desc$appId),] 
  app_desc_bigrams <- app_desc_bigrams[!is.na(app_desc_bigrams$appId),] 
  
  toDelete <- vector_apps[!vector_apps%in%vector_apps_bigram]
  
  toAccept_1gram <- app_desc %>% distinct(appId)
  toAccept_2gram <- app_desc_bigrams %>% distinct(appId)
  
  toAccept <- toAccept_1gram[!toAccept_1gram%in%toAccept_2gram]
  
  listToApp <- list(as.vector(unlist(toAccept)),as.vector(unlist(toDelete)))
  names(listToApp) <- c("accept", "delete")
  
  print("Hecho")
  
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
  # ## 2gram
  # desc_bigram_dtm <- word_counts_bigram %>%
  #   cast_dtm(appId, word_stem, n)
  # 
  # ## 1gram y 2gram
  # all_dtm <- all_word_counts %>%
  #   cast_dtm(appId, word_stem, n)
  # 
  # ################## Modelo LDA ################## 
  # 
  # valK <- as.numeric(valueK)
  # 
  # desc_lda <- LDA(desc_dtm, k = valK, control = list(seed = 1234))
  # desc_bigram_lda <- LDA(desc_bigram_dtm, k = valK, control = list(seed = 1234))
  # both_lda <- LDA(all_dtm, k = valK, control = list(seed = 1234))
  # 
  # tidied_model_documents <- tidy(desc_lda, matrix = "gamma")
  # bigram_tidied_model_documents <- tidy(desc_bigram_lda, matrix = "gamma")
  # both_tidied_model_documents <- tidy(both_lda, matrix = "gamma")
  # 
  # selectedApps <- 
  #   tidied_model_documents[tidied_model_documents$gamma > 0.7, ]
  # colnames(selectedApps)[1] <- "appId"
  # 
  # selectedApps2 <- 
  #   tidied_model_documents[tidied_model_documents$gamma > 0.0, ]
  # colnames(selectedApps2)[1] <- "appId"
  # 
  # print("FIN")
  # 
  # end.time <- Sys.time()
  # time.taken <- end.time - start.time
  # print(time.taken)
  # selectedApps
  # 
  # 
  # ###################################################################################
  # ###################################################################################
}
