# Prepare data for analysis mapping using the datausa api (https://datausa.io/about/api/)

# Set up
setwd('~/Documents/sea-change/public/prep/')
library(jsonlite)
library(httr)
library(dplyr)
library(tidyr)

# Get geographic id for Seattle
api.root <- 'https://api.datausa.io/'
endpoint <- 'attrs/geo'
query.params <- list(
    show="geo",
    sumleve="msa"
)
api.url <- paste0(api.root, endpoint)
response <- GET(api.url, query=query.params)
city.ids <- fromJSON(content(response, "text"))
seattle.id <- data.frame(city.ids$data) %>% filter(X9 == 'Seattle') %>% select(X8)

# Get tract level data on income, and other variables data
endpoint <- 'api'
query.params <- list(
  show="geo",
  sumlevel="tract", 
  geo=seattle.id[[1]]
)
tract.url <- paste0(api.root, endpoint)
response <- GET(tract.url, query = query.params)
request <- fromJSON(content(response, "text"))
seattle.data <- data.frame(request$data)
colnames(seattle.data) <- request$headers

# Get tract level data on race
endpoint <- 'api'
query.params <- list(
  show="geo",
  sumlevel="tract", 
  force="acs_5yr.yg_race", 
  geo=seattle.id[[1]]
)
race.url <- paste0(api.root, endpoint)
response <- GET(race.url, query = query.params)
request <- fromJSON(content(response, "text"))
race.data <- data.frame(request$data)
colnames(race.data) <- request$headers

# Merge dataframes
all.data <- left_join(seattle.data, race.data, by = c("geo" = "geo", "year" = "year"))

# Create geo.id column to match tract data in tracts.json
all.data$geo.id <- sub('14000US', '', seattle.data$geo)
write.csv(all.data, file ='./raw-data/all-seattle-data.csv', row.names=FALSE)

# Income change
income.data <- all.data %>% 
              mutate(year = paste0('income.', year), income=as.numeric(as.vector(income))) %>% 
              select(geo.id, income, year) %>% 
              spread(key = year, value=income) %>% 
              mutate(income.diff = income.2015 - income.2013, 
                     income.diff.pct = income.diff / income.2013) %>% 
              select(-income.2014)


# home.value change
home.value.data <- all.data %>% 
  mutate(year = paste0('home.value.', year), home.value=as.numeric(as.vector(median_property_value))) %>% 
  select(geo.id, home.value, year) %>% 
  spread(key = year, value=home.value) %>% 
  mutate(home.value.diff = home.value.2015 - home.value.2013, 
         home.value.diff.pct = home.value.diff / home.value.2013) %>% 
  select(-home.value.2014)

# Pop change
pop.data <- all.data %>% 
  mutate(year = paste0('pop.', year), pop=as.numeric(as.vector(pop))) %>% 
  select(geo.id, pop, year) %>% 
  spread(key = year, value=pop) %>% 
  mutate(pop.diff = pop.2015 - pop.2013, 
         pop.diff.pct = pop.diff / pop.2013) %>% 
  select(-pop.2014)

# age change
age.data <- all.data %>% 
  mutate(year = paste0('age.', year), age=as.numeric(as.vector(age))) %>% 
  select(geo.id, age, year) %>% 
  spread(key = year, value=age) %>% 
  mutate(age.diff = age.2015 - age.2013, 
         age.diff.pct = age.diff / age.2013) %>% 
  select(-age.2014)

# Percent English
pct.english.data <- all.data %>% 
  mutate(year = paste0('pct.english.', year), pct.english=1 - as.numeric(as.vector(non_eng_speakers_pct))) %>% 
  select(geo.id, pct.english, year) %>% 
  spread(key = year, value=pct.english) %>% 
  mutate(pct.english.diff = pct.english.2015 - pct.english.2013, 
         pct.english.diff.pct = pct.english.diff / pct.english.2013) %>% 
  select(-pct.english.2014)

# commute change
commute.data <- all.data %>% 
  mutate(year = paste0('commute.', year), commute=as.numeric(as.vector(mean_commute_minutes))) %>% 
  select(geo.id, commute, year) %>% 
  spread(key = year, value=commute) %>% 
  mutate(commute.diff = commute.2015 - commute.2013, 
         commute.diff.pct = commute.diff / commute.2013) %>% 
  select(-commute.2014)

# home.owner change
home.owner.data <- all.data %>% 
  mutate(year = paste0('home.owner.', year), home.owner=as.numeric(as.vector(owner_occupied_housing_units))) %>% 
  select(geo.id, home.owner, year) %>% 
  spread(key = year, value=home.owner) %>% 
  mutate(home.owner.diff = home.owner.2015 - home.owner.2013, 
         home.owner.diff.pct = home.owner.diff / home.owner.2013) %>% 
  select(-home.owner.2014)

# pct.citizens change
pct.citizens.data <- all.data %>% 
  mutate(year = paste0('pct.citizens.', year), pct.citizens=as.numeric(as.vector(us_citizens))) %>% 
  select(geo.id, pct.citizens, year) %>% 
  spread(key = year, value=pct.citizens) %>% 
  mutate(pct.citizens.diff = pct.citizens.2015 - pct.citizens.2013, 
         pct.citizens.diff.pct = pct.citizens.diff / pct.citizens.2013) %>% 
  select(-pct.citizens.2014)

# Percent white
pct.white.data <- all.data %>% 
  mutate(year = paste0('pct.white.', year), pct.white=as.numeric(as.vector(pop_white)) / as.numeric(as.vector(pop))) %>% 
  select(geo.id, pct.white, year) %>% 
  spread(key = year, value=pct.white) %>% 
  mutate(pct.white.diff = pct.white.2015 - pct.white.2013, 
         pct.white.diff.pct = pct.white.diff / pct.white.2013) %>% 
  select(-pct.white.2014)

# Join data
summary.data <- pop.data %>% 
                left_join(age.data) %>% 
                left_join(income.data) %>% 
                left_join(pct.english.data) %>% 
                left_join(pct.citizens.data) %>% 
                left_join(pct.white.data) %>% 
                left_join(home.owner.data) %>% 
                left_join(home.value.data) %>% 
                filter(!is.na(income.2013), !is.na(income.2015))

# Write summary file for visualizing
write.csv(summary.data, file ='../data/seattle-data.csv', row.names=FALSE)
  