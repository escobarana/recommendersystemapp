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
for(a in 1:nrow(app_desc_bigrams)){
  for(k in keywords_delete_bigrams){
    if(!is.na(app_desc_bigrams[a,2]) & !is.na(as.character(k))){
      if(app_desc_bigrams[a,2] == k){
        vector_apps_bigram <- c(vector_apps_bigram,app_desc_bigrams[a,1])
      }
    }
  }
}

vector_apps_bigram <- vector_apps_bigram[!duplicated(vector_apps_bigram)]


##1gram
keywords_delete  <- wordStem(word = c("ovulation", "fertil", "wearable", "baby", "pregnancy",
                                      "hypnosis", "longevity", "abs", "heavy",
                                      "watches", "trial", "membership", "premium",
                                      "subscription", "meditation", "purchase", "yoga", "pilates",
                                      "zen", "relax", "mind", "eat", "food", "sleep",
                                      "tarot", "slim", "device", "reiky", "weight", "pet", "nutrition",
                                      "calories", "medication", "kids"))

vector_apps <- c()
for(a in 1:nrow(app_desc)){
  for(k in keywords_delete){
    if(!is.na(app_desc[a,2]) & !is.na(as.character(k))){
      if(app_desc[a,2] == k){
        vector_apps <- c(vector_apps,app_desc[a,1])
      }
    }
  }
}

vector_apps <- vector_apps[!duplicated(vector_apps)]

apps_deletion <- c(vector_apps, vector_apps_bigram)
apps_deletion <- apps_deletion[!duplicated(apps_deletion)]

write.csv(apps_deletion,"D:\\Escritorio\\Uni\\Oviedo\\TFG\\TFG-Server-V1\\DataMining\\deletions.csv", row.names = FALSE)

d <- toJSON(apps_deletion, scalars = TRUE)
write(d, "D:\\Escritorio\\Uni\\Oviedo\\TFG\\TFG-Server-V1\\DataMining\\deletions_json.json")
