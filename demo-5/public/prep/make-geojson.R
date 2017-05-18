# Map data

# Set up
setwd('~/Documents/sea-change/public/prep/')
library(dplyr)
library(leaflet)
library(jsonlite)
library(RColorBrewer)
library(geojsonio)
library(rgdal)

# Load prepped data
seattle.data <- read.csv("../data/seattle-data.csv", stringsAsFactors = FALSE)

# Load in shapefile
# From: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2015&layergroup=Census+Tracts
# Transformed to json with: ogr2ogr -f geoJSON seattle.json tl_2015_53_tract.shp
tracts.url <- ('./raw-data/washington.json')

# Transform from JSON to GEOJSON
map.data <- file_to_geojson(input=tracts.url, method='local', output = ":memory:")

# Remove features from the map that are *not present* in the city data
# Add data to the geojson object
indicies <- vector()
for(i in 1:length(map.data$features)) {
  feat <- map.data$features[[i]]
  row <- seattle.data %>% filter(geo.id == feat$properties$GEOID)
  if(!nrow(row) || any(is.na(row$income))) {
    indicies <- c(indicies, i)
  }
  # else{
  #   map.data$features[[i]]$data <- seattle.data %>%
  #                                       filter(geo.id == feat$properties$GEOID)
  # }
}

map.data$features <- map.data$features[-indicies]

# Save map data
save(map.data, file = "./raw-data/map-data.Rdata")

# Write json
map.data.json <- toJSON(map.data)

write_json(map.data.json, '../data/seattle-prepped.json')

