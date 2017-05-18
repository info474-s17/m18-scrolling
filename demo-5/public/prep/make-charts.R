# Charts

summary.data <- read.csv('./data/summary-seattle-data.csv', stringsAsFactors = FALSE)

columns <- c("pop.diff.pct", "age.diff.pct", "income.diff.pct")
summary.data %>% select(one_of(columns)) %>% pairs()

columns <- c("pct.citizens.diff", "pct.english.diff", "pct.white.diff")
summary.data %>% select(one_of(columns)) %>% pairs()

# Income / owners / white / home value -- not super correlated
columns <- c("home.owner.diff.pct", "income.diff.pct", "pct.white.diff.pct", "home.value.diff.pct")
summary.data %>% select(one_of(columns)) %>% pairs()

