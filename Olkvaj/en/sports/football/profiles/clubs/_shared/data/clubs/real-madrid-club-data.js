/* ============================================================
   OLKVAJ — Club data: Real Madrid
   Location: sports/football/profiles/clubs/_shared/data/clubs/real-madrid-club-data.js
   ============================================================ */

   window.__CLUB_DATA__ = {
    "slug": "real-madrid",
    "name": "Real Madrid",
    "fullName": "Real Madrid Club de Fútbol",
    "founded": 1902,
    "city": "Madrid",
    "country": "spain",
    "countryName": "Spain",
    "league": "La Liga",
    "logoSlug": "real-madrid",
    "nicknames": ["Los Blancos", "Los Merengues"],
    "colours": ["White"],
    "lastUpdated": "September 2026",
  
    "overview": {
      "stats": [
        { "year": 1902, "label": "Founded" },
        { "value": "108", "label": "Total<br>Trophies" },
        { "value": "15",  "label": "European<br>Cups" },
        { "value": "36",  "label": "League<br>Titles" }
      ],
      "paragraphs": [
        "Real Madrid Club de Fútbol, commonly referred to as Real Madrid, is a Spanish professional football club based in Madrid. Founded in 1902 as Madrid Football Club, the club has traditionally worn a white home kit, giving rise to the nickname Los Blancos (\"The Whites\").",
        "Real Madrid is the most successful club in European football history, having won a record 15 European Cup/UEFA Champions League titles and a record 36 La Liga titles. The club's golden eras span the Alfredo Di Stéfano era of the 1950s and 60s, the Galácticos era of the 2000s, and the Cristiano Ronaldo era from 2009 to 2018. Real Madrid play their home matches at the Santiago Bernabéu Stadium and contest El Clásico with rivals Barcelona."
      ]
    },
  
    "totalTrophies": 108,
  
    "honours": [
      { "competition": "European Cup / Champions League", "count": 15, "note": "Last won 2024 · All-time record", "hero": true },
      { "competition": "La Liga", "count": 36, "note": "Last won 2024 · All-time record", "hero": true },
      { "competition": "Copa del Rey", "count": 20, "note": "Last won 2023", "hero": false },
      { "competition": "Supercopa de España", "count": 13, "note": "Last won 2024", "hero": false },
      { "competition": "FIFA Club World Cup / Intercontinental Cup", "count": 9, "note": "Last won 2024", "hero": false },
      { "competition": "UEFA Super Cup", "count": 6, "note": "Last won 2024", "hero": false }
    ],
  
    "finance": {
      "intro": "Real Madrid's financial overview — revenue streams, expense breakdown, commercial partnerships, and historical net profit/loss. All figures are in euros (€).",
      "netProfit": "+€110M",
  
      "revenue": {
        "total": "€1.18B",
        "totalYoy": "+12.4%",
        "pieGradient": "conic-gradient(#16a34a 0deg 144deg, #22c55e 144deg 252deg, #4ade80 252deg 342deg, #86efac 342deg 360deg)",
        "streams": [
          { "label": "Commercial & Sponsorship", "className": "commercial", "color": "#16a34a", "pct": "40%", "pctWidth": "40%", "amount": "€471M", "yoy": "+8.2%", "yoyDir": "up", "description": "Main sponsor, kit deals, sleeve, training kit, regional partners", "tooltip": "Bundles the main shirt sponsor (Emirates), kit manufacturer deal (Adidas), sleeve sponsor (HP), training kit partners, regional sponsorship deals, and the club's retail/licensing operation. Real Madrid's commercial revenue is the largest of any football club globally." },
          { "label": "Broadcasting Rights", "className": "broadcasting", "color": "#22c55e", "pct": "30%", "pctWidth": "30%", "amount": "€354M", "yoy": "+5.6%", "yoyDir": "up", "description": "La Liga TV deal, UEFA Champions League pool, international rights", "tooltip": "Includes La Liga's domestic TV deal, the UEFA Champions League pool distribution, and sales of international broadcast rights." },
          { "label": "Matchday Revenue", "className": "matchday", "color": "#4ade80", "pct": "25%", "pctWidth": "25%", "amount": "€295M", "yoy": "+18.4%", "yoyDir": "up", "description": "Bernabéu ticket sales, hospitality, tours, museum", "tooltip": "Ticket sales, hospitality boxes, stadium tours, and the Bernabéu museum. Driven sharply upward by the renovated Santiago Bernabéu." },
          { "label": "Other", "className": "other", "color": "#86efac", "pct": "5%", "pctWidth": "5%", "amount": "€60M", "yoy": "−3.2%", "yoyDir": "down", "description": "Player sales, events at Bernabéu, retail, media", "tooltip": "Player sales (transfer profits), non-football events hosted at the Bernabéu (concerts, NFL games), retail merchandise outside the main kit deal, and club media/content revenue." }
        ],
        "summary": {
          "season": "2024–25 season",
          "largest": "Commercial",
          "largestDesc": "€471M · 40% of total",
          "fastest": "Matchday",
          "fastestDesc": "+18.4% YoY · Bernabéu effect",
          "perStream": "€295M",
          "perStreamDesc": "Average across 4 streams"
        },
        "notes": [
          { "title": "Commercial dominance.", "body": "Real Madrid's commercial revenue is the highest in world football, ahead of Manchester City and Barcelona. The Adidas kit deal alone is worth an estimated €120M per season." },
          { "title": "Matchday surge.", "body": "The +18.4% YoY jump in matchday revenue reflects the first full season in the renovated Santiago Bernabéu, which added premium hospitality tiers and expanded non-matchday event capacity." },
          { "title": "Broadcasting ceiling.", "body": "Unlike Premier League clubs, La Liga's collective TV deal limits growth in this category. Growth here is largely driven by Champions League performance." },
          { "title": "Other revenue dip.", "body": "The −3.2% decline reflects fewer high-value player sales compared to the prior season, partially offset by increased Bernabéu event hosting." }
        ]
      },
  
      "expenses": {
        "total": "€1.07B",
        "totalYoy": "+8.7%",
        "pieGradient": "conic-gradient(#dc2626 0deg 187deg, #ef4444 187deg 295deg, #f87171 295deg 342deg, #fca5a5 342deg 360deg)",
        "categories": [
          { "label": "Player Wages & Salaries", "className": "wages", "color": "#dc2626", "pct": "52%", "pctWidth": "52%", "amount": "€556M", "yoy": "+6.4%", "yoyDir": "up", "description": "First-team squad, coaching staff, bonuses", "tooltip": "First-team squad salaries, coaching staff wages, image rights payments, performance bonuses, and severance payments." },
          { "label": "Operations & Admin", "className": "operations", "color": "#ef4444", "pct": "30%", "pctWidth": "30%", "amount": "€321M", "yoy": "+4.1%", "yoyDir": "up", "description": "Club staff, day-to-day operations, administration", "tooltip": "Non-playing club staff, day-to-day operations, administrative costs, scouting network, youth academy (La Fábrica) running costs, marketing and commercial department expenses, and match-day operational overhead." },
          { "label": "Stadium & Infrastructure", "className": "stadium", "color": "#f87171", "pct": "13%", "pctWidth": "13%", "amount": "€140M", "yoy": "+22.1%", "yoyDir": "up", "description": "Bernabéu maintenance, Valdebebas, renovation loan repayments", "tooltip": "Santiago Bernabéu maintenance and operating costs, the Ciudad Real Madrid training complex at Valdebebas, and interest payments on the ~€1.2B renovation loan." },
          { "label": "Other", "className": "other", "color": "#fca5a5", "pct": "5%", "pctWidth": "5%", "amount": "€53M", "yoy": "−8.6%", "yoyDir": "down", "description": "Transfer amortization, misc. expenses", "tooltip": "Transfer fee amortization (the annual write-down of transfer fees across contract length), agent fees, miscellaneous legal and compliance costs, and small one-off expenditures." }
        ],
        "summary": {
          "season": "2024–25 season",
          "largest": "Wages",
          "largestDesc": "€556M · 52% of total",
          "fastest": "Stadium",
          "fastestDesc": "+22.1% YoY · Renovation costs",
          "perCategory": "€268M",
          "perCategoryDesc": "Average across 4 categories"
        },
        "notes": [
          { "title": "Wage discipline.", "body": "At 52% of total expenses and 47% of revenue, Real Madrid's wage bill is among the healthiest in European football." },
          { "title": "Stadium cost surge.", "body": "The +22.1% YoY jump reflects the first full year of loan repayments and operations for the renovated Bernabéu, plus higher energy and maintenance costs." },
          { "title": "Operations scale.", "body": "Elevated by the club's global commercial operation, its extensive youth academy (La Fábrica), and its large non-playing staff footprint." },
          { "title": "Transfer amortization decline.", "body": "The −8.6% drop in \"Other\" reflects the completion of amortization on several older high-value signings. Amortization is an accounting cost, not a cash outflow." }
        ]
      },
  
      "sponsors": {
        "list": [
          { "name": "Adidas", "logo": "AE", "category": "sportswear", "subCategory": "Kit Manufacturer", "scope": "Global", "className": "kit", "since": "1998 · 28 yrs", "durationWidth": "100%", "value": "~€120M" },
          { "name": "Emirates", "logo": "FE", "category": "shirt", "subCategory": "Main Shirt Sponsor", "scope": "Global", "className": "shirt", "since": "2013 · 13 yrs", "durationWidth": "44.5%", "value": "~€70M" },
          { "name": "HP", "logo": "HP", "category": "technology", "subCategory": "Sleeve Sponsor", "scope": "Global", "className": "tech", "since": "2023 · 3 yrs", "durationWidth": "7.4%", "value": "~€25M" },
          { "name": "Mercedes-Benz", "logo": "MB", "category": "automotive", "subCategory": "Automotive Partner", "scope": "Regional", "className": "automotive", "since": "2022 · 4 yrs", "durationWidth": "11.1%", "value": "~€15M" },
          { "name": "Mahou", "logo": "MS", "category": "beverage", "subCategory": "Beer Partner", "scope": "Regional", "className": "beverage", "since": "2001 · 25 yrs", "durationWidth": "88.9%", "value": "~€10M" },
          { "name": "EA Sports", "logo": "EA", "category": "technology", "subCategory": "Gaming Partner", "scope": "Global", "className": "tech", "since": "2020 · 6 yrs", "durationWidth": "18.5%", "value": "~€20M" },
          { "name": "Nivea Men", "logo": "N", "category": "service", "subCategory": "Personal Care Partner", "scope": "Regional", "className": "service", "since": "2019 · 7 yrs", "durationWidth": "22.2%", "value": "~€8M" },
          { "name": "Palladium Hotel Group", "logo": "P", "category": "service", "subCategory": "Hospitality Partner", "scope": "Regional", "className": "service", "since": "2021 · 5 yrs", "durationWidth": "14.8%", "value": "~€6M" },
          { "name": "Sanitas", "logo": "S", "category": "service", "subCategory": "Medical Partner", "scope": "Technical", "className": "service", "since": "2014 · 12 yrs", "durationWidth": "40.7%", "value": "~€5M" },
          { "name": "Coca-Cola", "logo": "C", "category": "beverage", "subCategory": "Soft Drink Partner", "scope": "Regional", "className": "beverage", "since": "2018 · 8 yrs", "durationWidth": "25.9%", "value": "~€8M" },
          { "name": "Armani", "logo": "A", "category": "service", "subCategory": "Formal Wear Partner", "scope": "Technical", "className": "service", "since": "2015 · 11 yrs", "durationWidth": "37%", "value": "~€4M" },
          { "name": "Microsoft", "logo": "M", "category": "technology", "subCategory": "Technology Partner", "scope": "Global", "className": "tech", "since": "2022 · 4 yrs", "durationWidth": "11.1%", "value": "~€10M" }
        ],
        "timeline": {
          "title": "Partnership timeline — 1995 to present",
          "years": [
            { "left": "0%",   "label": "1995" },
            { "left": "20%",  "label": "2001" },
            { "left": "40%",  "label": "2007" },
            { "left": "60%",  "label": "2013" },
            { "left": "80%",  "label": "2019" },
            { "left": "100%", "label": "2025" }
          ],
          "rows": [
            { "name": "Adidas",        "className": "kit",        "left": "10%",   "width": "90%",  "title": "1998–present" },
            { "name": "Emirates",      "className": "shirt",      "left": "60%",   "width": "40%",  "title": "2013–present" },
            { "name": "HP",            "className": "tech",       "left": "93.3%", "width": "6.7%", "title": "2023–present" },
            { "name": "Mercedes-Benz", "className": "automotive", "left": "90%",   "width": "10%",  "title": "2022–present" },
            { "name": "Mahou",         "className": "beverage",   "left": "20%",   "width": "80%",  "title": "2001–present" },
            { "name": "EA Sports",     "className": "tech",       "left": "83.3%", "width": "16.7%","title": "2020–present" },
            { "name": "Nivea Men",     "className": "service",    "left": "80%",   "width": "20%",  "title": "2019–present" },
            { "name": "Palladium",     "className": "service",    "left": "86.7%", "width": "13.3%","title": "2021–present" },
            { "name": "Sanitas",       "className": "service",    "left": "63.3%", "width": "36.7%","title": "2014–present" },
            { "name": "Coca-Cola",     "className": "beverage",   "left": "76.7%", "width": "23.3%","title": "2018–present" },
            { "name": "Armani",        "className": "service",    "left": "66.7%", "width": "33.3%","title": "2015–present" },
            { "name": "Microsoft",     "className": "tech",       "left": "90%",   "width": "10%",  "title": "2022–present" }
          ]
        },
        "summary": {
          "season": "2024–25",
          "totalPartners": "12",
          "totalPartnersDesc": "Active in 2024–25",
          "longest": "Adidas",
          "longestDesc": "28 years · since 1998",
          "newest": "HP",
          "newestDesc": "3 years · since 2023",
          "totalValue": "€471M",
          "totalValueDesc": "Commercial revenue 2024–25",
          "totalEstValue": "~€301M"
        },
        "notes": [
          { "title": "Adidas is the anchor.", "body": "The kit deal signed in 1998 has run for 28 years and is reportedly worth €120M per season — the largest kit deal in world football. Renewed through 2028." },
          { "title": "Emirates renewal.", "body": "The main shirt sponsor since 2013, Emirates renewed its deal in 2022 through 2026 at roughly €70M per season." },
          { "title": "Sleeve sponsorship added.", "body": "The HP sleeve deal (signed 2023) is a relatively new revenue stream that didn't exist a decade ago." },
          { "title": "Estimated values.", "body": "Annual value figures are estimates based on public reporting and industry benchmarks." },
          { "title": "Category balance.", "body": "Real Madrid's partners span six sectors — reducing dependency on any single industry in case of market downturns." }
        ]
      },
  
      "history": {
        "chartTitle": "Net Profit (€M) — 26 Seasons Trend",
        "seasons": [
          { "season": "2000–01", "shortLabel": "00/01", "revenue": "€138M", "expenses": "€128M", "profit": 10,   "profitDisplay": "+€10M",  "profitMargin": "7.2%",  "revenueGrowth": "—",     "rollingAvg": "+€10M",   "trend": "+100%", "yoy": "+100%" },
          { "season": "2001–02", "shortLabel": "01/02", "revenue": "€152M", "expenses": "€137M", "profit": 15,   "profitDisplay": "+€15M",  "profitMargin": "9.9%",  "revenueGrowth": "+10.1%", "rollingAvg": "+€12.5M", "trend": "+50%",  "yoy": "+50%" },
          { "season": "2002–03", "shortLabel": "02/03", "revenue": "€187M", "expenses": "€167M", "profit": 20,   "profitDisplay": "+€20M",  "profitMargin": "10.7%", "revenueGrowth": "+23.0%", "rollingAvg": "+€15M",   "trend": "+33%",  "yoy": "+33%" },
          { "season": "2003–04", "shortLabel": "03/04", "revenue": "€236M", "expenses": "€206M", "profit": 30,   "profitDisplay": "+€30M",  "profitMargin": "12.7%", "revenueGrowth": "+26.2%", "rollingAvg": "+€21.7M", "trend": "+50%",  "yoy": "+50%" },
          { "season": "2004–05", "shortLabel": "04/05", "revenue": "€276M", "expenses": "€236M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "14.5%", "revenueGrowth": "+16.9%", "rollingAvg": "+€30M",   "trend": "+33%",  "yoy": "+33%" },
          { "season": "2005–06", "shortLabel": "05/06", "revenue": "€292M", "expenses": "€257M", "profit": 35,   "profitDisplay": "+€35M",  "profitMargin": "12.0%", "revenueGrowth": "+5.8%",  "rollingAvg": "+€35M",   "trend": "−12.5%","yoy": "−12.5%" },
          { "season": "2006–07", "shortLabel": "06/07", "revenue": "€351M", "expenses": "€326M", "profit": 25,   "profitDisplay": "+€25M",  "profitMargin": "7.1%",  "revenueGrowth": "+20.2%", "rollingAvg": "+€33.3M", "trend": "−28.6%","yoy": "−28.6%" },
          { "season": "2007–08", "shortLabel": "07/08", "revenue": "€366M", "expenses": "€336M", "profit": 30,   "profitDisplay": "+€30M",  "profitMargin": "8.2%",  "revenueGrowth": "+4.3%",  "rollingAvg": "+€30M",   "trend": "+20%",  "yoy": "+20%" },
          { "season": "2008–09", "shortLabel": "08/09", "revenue": "€400M", "expenses": "€360M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "10.0%", "revenueGrowth": "+9.3%",  "rollingAvg": "+€31.7M", "trend": "+33%",  "yoy": "+33%" },
          { "season": "2009–10", "shortLabel": "09/10", "revenue": "€440M", "expenses": "€410M", "profit": 30,   "profitDisplay": "+€30M",  "profitMargin": "6.8%",  "revenueGrowth": "+10.0%", "rollingAvg": "+€33.3M", "trend": "−25%",  "yoy": "−25%" },
          { "season": "2010–11", "shortLabel": "10/11", "revenue": "€480M", "expenses": "€445M", "profit": 35,   "profitDisplay": "+€35M",  "profitMargin": "7.3%",  "revenueGrowth": "+9.1%",  "rollingAvg": "+€35M",   "trend": "+16.7%","yoy": "+16.7%" },
          { "season": "2011–12", "shortLabel": "11/12", "revenue": "€514M", "expenses": "€474M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "7.8%",  "revenueGrowth": "+7.1%",  "rollingAvg": "+€35M",   "trend": "+14.3%","yoy": "+14.3%" },
          { "season": "2012–13", "shortLabel": "12/13", "revenue": "€521M", "expenses": "€476M", "profit": 45,   "profitDisplay": "+€45M",  "profitMargin": "8.6%",  "revenueGrowth": "+1.4%",  "rollingAvg": "+€40M",   "trend": "+12.5%","yoy": "+12.5%" },
          { "season": "2013–14", "shortLabel": "13/14", "revenue": "€550M", "expenses": "€510M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "7.3%",  "revenueGrowth": "+5.6%",  "rollingAvg": "+€41.7M", "trend": "−11.1%","yoy": "−11.1%" },
          { "season": "2014–15", "shortLabel": "14/15", "revenue": "€577M", "expenses": "€532M", "profit": 45,   "profitDisplay": "+€45M",  "profitMargin": "7.8%",  "revenueGrowth": "+4.9%",  "rollingAvg": "+€43.3M", "trend": "+12.5%","yoy": "+12.5%" },
          { "season": "2015–16", "shortLabel": "15/16", "revenue": "€620M", "expenses": "€590M", "profit": 30,   "profitDisplay": "+€30M",  "profitMargin": "4.8%",  "revenueGrowth": "+7.5%",  "rollingAvg": "+€38.3M", "trend": "−33.3%","yoy": "−33.3%" },
          { "season": "2016–17", "shortLabel": "16/17", "revenue": "€675M", "expenses": "€615M", "profit": 60,   "profitDisplay": "+€60M",  "profitMargin": "8.9%",  "revenueGrowth": "+8.9%",  "rollingAvg": "+€45M",   "trend": "+100%", "yoy": "+100%" },
          { "season": "2017–18", "shortLabel": "17/18", "revenue": "€750M", "expenses": "€700M", "profit": 50,   "profitDisplay": "+€50M",  "profitMargin": "6.7%",  "revenueGrowth": "+11.1%", "rollingAvg": "+€46.7M", "trend": "−16.7%","yoy": "−16.7%" },
          { "season": "2018–19", "shortLabel": "18/19", "revenue": "€755M", "expenses": "€715M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "5.3%",  "revenueGrowth": "+0.7%",  "rollingAvg": "+€43.3M", "trend": "−20%",  "yoy": "−20%" },
          { "season": "2019–20", "shortLabel": "19/20", "revenue": "€715M", "expenses": "€690M", "profit": 25,   "profitDisplay": "+€25M",  "profitMargin": "3.5%",  "revenueGrowth": "−5.3%",  "rollingAvg": "+€38.3M", "trend": "−37.5%","yoy": "−37.5%" },
          { "season": "2020–21", "shortLabel": "20/21", "revenue": "€653M", "expenses": "€673M", "profit": -20,  "profitDisplay": "−€20M",  "profitMargin": "−3.1%", "revenueGrowth": "−8.7%",  "rollingAvg": "+€15M",   "trend": "−180%", "yoy": "−180%" },
          { "season": "2021–22", "shortLabel": "21/22", "revenue": "€722M", "expenses": "€682M", "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "5.5%",  "revenueGrowth": "+10.6%", "rollingAvg": "+€15M",   "trend": "+300%", "yoy": "+300%" },
          { "season": "2022–23", "shortLabel": "22/23", "revenue": "€843M", "expenses": "€783M", "profit": 60,   "profitDisplay": "+€60M",  "profitMargin": "7.1%",  "revenueGrowth": "+16.8%", "rollingAvg": "+€26.7M", "trend": "+50%",  "yoy": "+50%" },
          { "season": "2023–24", "shortLabel": "23/24", "revenue": "€1.05B","expenses": "€970M", "profit": 80,   "profitDisplay": "+€80M",  "profitMargin": "7.6%",  "revenueGrowth": "+24.6%", "rollingAvg": "+€60M",   "trend": "+33.3%","yoy": "+33.3%" },
          { "season": "2024–25", "shortLabel": "24/25", "revenue": "€1.18B","expenses": "€1.07B","profit": 110,  "profitDisplay": "+€110M", "profitMargin": "9.3%",  "revenueGrowth": "+12.4%", "rollingAvg": "+€83.3M", "trend": "+37.5%","yoy": "+37.5%" },
          { "season": "2025–26", "shortLabel": "25/26", "revenue": "€1.25B","expenses": "€1.13B","profit": 120,  "profitDisplay": "+€120M", "profitMargin": "9.6%",  "revenueGrowth": "+5.9%",  "rollingAvg": "+€103.3M","trend": "+9.1%", "yoy": "+9.1%" }
        ],
        "summary": {
          "title": "26-Season Summary (2000–2026)",
          "totalProfit": "+€1.10B",
          "totalProfitLabel": "Total Profit<br>(26 seasons)",
          "totalProfitTooltip": "Total net profit accumulated across all 26 seasons (2000–01 to 2025–26).",
          "bestYear": "+€120M",
          "bestYearLabel": "Best Year<br>2025–26",
          "bestYearTooltip": "The single season with the highest net profit. Best year was 2025–26 with +€120M.",
          "worstYear": "−€20M",
          "worstYearLabel": "Worst Year<br>2020–21",
          "worstYearTooltip": "The single season with the lowest net result. Worst year was 2020–21 with −€20M.",
          "avgProfit": "+€42.3M",
          "avgLabel": "Avg Net Profit<br>per Season",
          "avgTooltip": "Arithmetic mean of net profit across all 26 seasons.",
          "profitable": "25 / 26",
          "profitableLabel": "Profitable<br>Seasons",
          "profitableTooltip": "25 of 26 seasons ended profitable; only 2020–21 posted a loss."
        },
        "analytics": {
          "revenueCagr": "+8.9%",
          "revenueCagrDesc": "From €138M (2000) to €1.25B (2025)",
          "expensesCagr": "+8.5%",
          "expensesCagrDesc": "From €128M (2000) to €1.13B (2025)",
          "wageRevenue": "47.1%",
          "wageRevenueDesc": "€556M wages ÷ €1.18B revenue (2024–25)",
          "profitMargin": "9.3%",
          "profitMarginDesc": "€110M profit ÷ €1.18B revenue (2024–25)"
        },
        "decades": [
          {
            "title": "2020s",
            "total": "+€390M",
            "seasons": [
              { "season": "2025–26", "revenue": "€1.25B", "expenses": "€1.13B", "profit": 120,  "profitDisplay": "+€120M", "profitMargin": "9.6%",  "revenueGrowth": "+5.9%",  "rollingAvg": "+€103.3M", "trend": "+9.1%",  "yoy": "+9.1%" },
              { "season": "2024–25", "revenue": "€1.18B", "expenses": "€1.07B", "profit": 110,  "profitDisplay": "+€110M", "profitMargin": "9.3%",  "revenueGrowth": "+12.4%", "rollingAvg": "+€83.3M",  "trend": "+37.5%", "yoy": "+37.5%" },
              { "season": "2023–24", "revenue": "€1.05B", "expenses": "€970M",  "profit": 80,   "profitDisplay": "+€80M",  "profitMargin": "7.6%",  "revenueGrowth": "+24.6%", "rollingAvg": "+€60M",    "trend": "+33.3%", "yoy": "+33.3%" },
              { "season": "2022–23", "revenue": "€843M",  "expenses": "€783M",  "profit": 60,   "profitDisplay": "+€60M",  "profitMargin": "7.1%",  "revenueGrowth": "+16.8%", "rollingAvg": "+€26.7M",  "trend": "+50%",   "yoy": "+50%" },
              { "season": "2021–22", "revenue": "€722M",  "expenses": "€682M",  "profit": 40,   "profitDisplay": "+€40M",  "profitMargin": "5.5%",  "revenueGrowth": "+10.6%", "rollingAvg": "+€15M",    "trend": "+300%",  "yoy": "+300%" },
              { "season": "2020–21", "revenue": "€653M",  "expenses": "€673M",  "profit": -20,  "profitDisplay": "−€20M",  "profitMargin": "−3.1%", "revenueGrowth": "−8.7%",  "rollingAvg": "+€15M",    "trend": "−180%",  "yoy": "−180%" }
            ]
          },
          {
            "title": "2010s",
            "total": "+€395M",
            "seasons": [
              { "season": "2019–20", "revenue": "€715M", "expenses": "€690M", "profit": 25,  "profitDisplay": "+€25M", "profitMargin": "3.5%", "revenueGrowth": "−5.3%", "rollingAvg": "+€38.3M", "trend": "−37.5%", "yoy": "−37.5%" },
              { "season": "2018–19", "revenue": "€755M", "expenses": "€715M", "profit": 40,  "profitDisplay": "+€40M", "profitMargin": "5.3%", "revenueGrowth": "+0.7%", "rollingAvg": "+€43.3M", "trend": "−20%",   "yoy": "−20%" },
              { "season": "2017–18", "revenue": "€750M", "expenses": "€700M", "profit": 50,  "profitDisplay": "+€50M", "profitMargin": "6.7%", "revenueGrowth": "+11.1%","rollingAvg": "+€46.7M", "trend": "−16.7%", "yoy": "−16.7%" },
              { "season": "2016–17", "revenue": "€675M", "expenses": "€615M", "profit": 60,  "profitDisplay": "+€60M", "profitMargin": "8.9%", "revenueGrowth": "+8.9%", "rollingAvg": "+€45M",   "trend": "+100%",  "yoy": "+100%" },
              { "season": "2015–16", "revenue": "€620M", "expenses": "€590M", "profit": 30,  "profitDisplay": "+€30M", "profitMargin": "4.8%", "revenueGrowth": "+7.5%", "rollingAvg": "+€38.3M", "trend": "−33.3%", "yoy": "−33.3%" },
              { "season": "2014–15", "revenue": "€577M", "expenses": "€532M", "profit": 45,  "profitDisplay": "+€45M", "profitMargin": "7.8%", "revenueGrowth": "+4.9%", "rollingAvg": "+€43.3M", "trend": "+12.5%", "yoy": "+12.5%" },
              { "season": "2013–14", "revenue": "€550M", "expenses": "€510M", "profit": 40,  "profitDisplay": "+€40M", "profitMargin": "7.3%", "revenueGrowth": "+5.6%", "rollingAvg": "+€41.7M", "trend": "−11.1%", "yoy": "−11.1%" },
              { "season": "2012–13", "revenue": "€521M", "expenses": "€476M", "profit": 45,  "profitDisplay": "+€45M", "profitMargin": "8.6%", "revenueGrowth": "+1.4%", "rollingAvg": "+€40M",   "trend": "+12.5%", "yoy": "+12.5%" },
              { "season": "2011–12", "revenue": "€514M", "expenses": "€474M", "profit": 40,  "profitDisplay": "+€40M", "profitMargin": "7.8%", "revenueGrowth": "+7.1%", "rollingAvg": "+€35M",   "trend": "+14.3%", "yoy": "+14.3%" },
              { "season": "2010–11", "revenue": "€480M", "expenses": "€445M", "profit": 35,  "profitDisplay": "+€35M", "profitMargin": "7.3%", "revenueGrowth": "+9.1%", "rollingAvg": "+€35M",   "trend": "+16.7%", "yoy": "+16.7%" }
            ]
          },
          {
            "title": "2000s",
            "total": "+€315M",
            "seasons": [
              { "season": "2009–10", "revenue": "€440M", "expenses": "€410M", "profit": 30, "profitDisplay": "+€30M", "profitMargin": "6.8%",  "revenueGrowth": "+10.0%", "rollingAvg": "+€33.3M", "trend": "−25%",   "yoy": "−25%" },
              { "season": "2008–09", "revenue": "€400M", "expenses": "€360M", "profit": 40, "profitDisplay": "+€40M", "profitMargin": "10.0%", "revenueGrowth": "+9.3%",  "rollingAvg": "+€31.7M", "trend": "+33%",   "yoy": "+33%" },
              { "season": "2007–08", "revenue": "€366M", "expenses": "€336M", "profit": 30, "profitDisplay": "+€30M", "profitMargin": "8.2%",  "revenueGrowth": "+4.3%",  "rollingAvg": "+€30M",   "trend": "+20%",   "yoy": "+20%" },
              { "season": "2006–07", "revenue": "€351M", "expenses": "€326M", "profit": 25, "profitDisplay": "+€25M", "profitMargin": "7.1%",  "revenueGrowth": "+20.2%", "rollingAvg": "+€33.3M", "trend": "−28.6%", "yoy": "−28.6%" },
              { "season": "2005–06", "revenue": "€292M", "expenses": "€257M", "profit": 35, "profitDisplay": "+€35M", "profitMargin": "12.0%", "revenueGrowth": "+5.8%",  "rollingAvg": "+€35M",   "trend": "−12.5%", "yoy": "−12.5%" },
              { "season": "2004–05", "revenue": "€276M", "expenses": "€236M", "profit": 40, "profitDisplay": "+€40M", "profitMargin": "14.5%", "revenueGrowth": "+16.9%", "rollingAvg": "+€30M",   "trend": "+33%",   "yoy": "+33%" },
              { "season": "2003–04", "revenue": "€236M", "expenses": "€206M", "profit": 30, "profitDisplay": "+€30M", "profitMargin": "12.7%", "revenueGrowth": "+26.2%", "rollingAvg": "+€21.7M", "trend": "+50%",   "yoy": "+50%" },
              { "season": "2002–03", "revenue": "€187M", "expenses": "€167M", "profit": 20, "profitDisplay": "+€20M", "profitMargin": "10.7%", "revenueGrowth": "+23.0%", "rollingAvg": "+€15M",   "trend": "+33%",   "yoy": "+33%" },
              { "season": "2001–02", "revenue": "€152M", "expenses": "€137M", "profit": 15, "profitDisplay": "+€15M", "profitMargin": "9.9%",  "revenueGrowth": "+10.1%", "rollingAvg": "+€12.5M", "trend": "+50%",   "yoy": "+50%" },
              { "season": "2000–01", "revenue": "€138M", "expenses": "€128M", "profit": 10, "profitDisplay": "+€10M", "profitMargin": "7.2%",  "revenueGrowth": "—",      "rollingAvg": "+€10M",   "trend": "+100%",  "yoy": "+100%" }
            ]
          }
        ]
      }
    },
  
    "stadium": {
      "name": "Santiago Bernabéu",
      "openedDate": "1947-12-14",
      "opened": "14 December 1947",
      "capacity": "78,297",
      "location": "Madrid, Spain",
      "renovation": "1982, 2001, 2019–2024",
      "uefaCategory": "Category 4",
      "nickname": "El Bernabéu",
      "tenants": "Real Madrid",
      "intro": "Real Madrid play their home matches at the Santiago Bernabéu Stadium, one of the most iconic football venues in the world. Named after former club president Santiago Bernabéu, the stadium has undergone major renovations, most recently completed in 2024, transforming it into a state-of-the-art multi-purpose arena.",
      "trainingGround": {
        "facility": "Ciudad Real Madrid",
        "location": "Valdebebas, Madrid",
        "openedYear": 2005,
        "size": "1.2 million m²"
      }
    },
  
    "staff": {
      "intro": "Real Madrid's current and historical staff — from the head coach and their assistants, to the club's leadership and past presidents. Hover over any period to see the exact start and end dates, or hover over a flag to see the person's nationality.",
      "current": {
        "summary": {
          "headCoach": "José Mourinho",
          "headCoachDesc": "Since March 2026",
          "coachingStaff": "5 members",
          "coachingStaffDesc": "Assistants, GK, fitness",
          "president": "Florentino Pérez",
          "presidentDesc": "Since June 2009",
          "boardMembers": "5 listed",
          "boardMembersDesc": "VPs and board"
        },
        "coaching": [
          { "name": "José Mourinho",    "flag": "portugal", "country": "Portugal", "role": "Head Coach",        "since": "March 2026", "sinceDate": "16 March 2026", "current": true },
          { "name": "Davide Ancelotti", "flag": "spain",    "country": "Spain",    "role": "Assistant Coach",   "since": "March 2026", "sinceDate": "16 March 2026" },
          { "name": "Fernando Hierro",  "flag": "spain",    "country": "Spain",    "role": "Assistant Coach",   "since": "March 2026", "sinceDate": "16 March 2026" },
          { "name": "Luis Llopis",      "flag": "spain",    "country": "Spain",    "role": "Goalkeeping Coach", "since": "March 2026", "sinceDate": "16 March 2026" },
          { "name": "Simone Montanaro", "flag": "italy",    "country": "Italy",    "role": "Fitness Coach",     "since": "March 2026", "sinceDate": "16 March 2026" },
          { "name": "Santiago Solari",  "flag": "spain",    "country": "Spain",    "role": "Sporting Director", "since": "July 2025",  "sinceDate": "1 July 2025" }
        ],
        "leadership": [
          { "name": "Florentino Pérez",          "flag": "spain", "country": "Spain", "role": "President",     "since": "June 2009", "sinceDate": "1 June 2009", "current": true },
          { "name": "Eduardo Fernández de Blas", "flag": "spain", "country": "Spain", "role": "Vice President","since": "June 2009", "sinceDate": "1 June 2009" },
          { "name": "Pedro López Jiménez",       "flag": "spain", "country": "Spain", "role": "Vice President","since": "June 2009", "sinceDate": "1 June 2009" },
          { "name": "José Manuel Otero Lastres", "flag": "spain", "country": "Spain", "role": "Board Member",  "since": "June 2013", "sinceDate": "1 June 2013" },
          { "name": "Catalina Miñarro",          "flag": "spain", "country": "Spain", "role": "Board Member",  "since": "June 2013", "sinceDate": "1 June 2013" }
        ]
      },
      "managers": {
        "summary": {
          "total": "30",
          "mostDecorated": "Zidane · Ancelotti",
          "mostDecoratedDesc": "11 trophies each",
          "longestTenure": "Miguel Muñoz",
          "longestTenureDesc": "14 years · 1960–1974",
          "current": "José Mourinho",
          "currentDesc": "Since March 2026"
        },
        "list": [
          { "name": "José Mourinho",        "flag": "portugal",    "country": "Portugal",    "period": "2026–present", "note": "2nd spell",                     "trophies": 0,  "current": true },
          { "name": "Carlo Ancelotti",      "flag": "italy",       "country": "Italy",       "period": "2021–2025",    "note": "2nd spell",                     "trophies": 7 },
          { "name": "Zinédine Zidane",      "flag": "france",      "country": "France",      "period": "2019–2021",    "note": "2nd spell",                     "trophies": 2 },
          { "name": "Santiago Solari",      "flag": "spain",       "country": "Spain",       "period": "2018–2019",    "note": "Interim → permanent",           "trophies": 1 },
          { "name": "Julen Lopetegui",      "flag": "spain",       "country": "Spain",       "period": "2018",         "note": "Sacked after 14 games",         "trophies": 0 },
          { "name": "Zinédine Zidane",      "flag": "france",      "country": "France",      "period": "2016–2018",    "note": "1st spell",                     "trophies": 9 },
          { "name": "Rafa Benítez",         "flag": "spain",       "country": "Spain",       "period": "2015–2016",    "note": "7 months",                      "trophies": 0 },
          { "name": "Carlo Ancelotti",      "flag": "italy",       "country": "Italy",       "period": "2013–2015",    "note": "1st spell",                     "trophies": 4 },
          { "name": "José Mourinho",        "flag": "portugal",    "country": "Portugal",    "period": "2010–2013",    "note": "1st spell",                     "trophies": 3 },
          { "name": "Manuel Pellegrini",    "flag": "chile",       "country": "Chile",       "period": "2009–2010",    "note": "One season",                    "trophies": 0 },
          { "name": "Juande Ramos",         "flag": "spain",       "country": "Spain",       "period": "2008–2009",    "note": "Interim",                       "trophies": 0 },
          { "name": "Bernd Schuster",       "flag": "germany",     "country": "Germany",     "period": "2007–2008",    "note": "La Liga + Supercopa",           "trophies": 2 },
          { "name": "Fabio Capello",        "flag": "italy",       "country": "Italy",       "period": "2006–2007",    "note": "2nd spell · La Liga",           "trophies": 1 },
          { "name": "López Caro",           "flag": "spain",       "country": "Spain",       "period": "2005–2006",    "note": "Interim",                       "trophies": 0 },
          { "name": "Vanderlei Luxemburgo", "flag": "brazil",      "country": "Brazil",      "period": "2004–2005",    "note": "One season",                    "trophies": 0 },
          { "name": "Mariano García Remón", "flag": "spain",       "country": "Spain",       "period": "2004",         "note": "Interim",                       "trophies": 0 },
          { "name": "José Antonio Camacho", "flag": "spain",       "country": "Spain",       "period": "2004",         "note": "Interim",                       "trophies": 0 },
          { "name": "Carlos Queiroz",       "flag": "portugal",    "country": "Portugal",    "period": "2003–2004",    "note": "One season",                    "trophies": 1 },
          { "name": "Vicente del Bosque",   "flag": "spain",       "country": "Spain",       "period": "1999–2003",    "note": "Golden generation",             "trophies": 7 },
          { "name": "John Toshack",         "flag": "wales",       "country": "Wales",       "period": "1999",         "note": "Interim",                       "trophies": 0 },
          { "name": "Guus Hiddink",         "flag": "netherlands", "country": "Netherlands", "period": "1998–1999",    "note": "Intercontinental Cup",          "trophies": 1 },
          { "name": "Jupp Heynckes",        "flag": "germany",     "country": "Germany",     "period": "1997–1998",    "note": "Champions League",              "trophies": 1 },
          { "name": "Fabio Capello",        "flag": "italy",       "country": "Italy",       "period": "1996–1997",    "note": "1st spell · La Liga",           "trophies": 1 },
          { "name": "Jorge Valdano",        "flag": "argentina",   "country": "Argentina",   "period": "1994–1996",    "note": "La Liga",                       "trophies": 1 },
          { "name": "Vicente del Bosque",   "flag": "spain",       "country": "Spain",       "period": "1994",         "note": "Interim",                       "trophies": 0 },
          { "name": "Benito Floro",         "flag": "spain",       "country": "Spain",       "period": "1992–1994",    "note": "Copa del Rey",                  "trophies": 1 },
          { "name": "Valeriy Karpin",       "flag": "russia",      "country": "Russia",      "period": "1992",         "note": "Interim",                       "trophies": 0 },
          { "name": "Leo Beenhakker",       "flag": "netherlands", "country": "Netherlands", "period": "1986–1989",    "note": "Three straight La Ligas",       "trophies": 3 },
          { "name": "Luis Molowny",         "flag": "spain",       "country": "Spain",       "period": "1974–1986",    "note": "Multiple spells",               "trophies": 5 },
          { "name": "Miguel Muñoz",         "flag": "spain",       "country": "Spain",       "period": "1960–1974",    "note": "Longest-serving · 14 years",    "trophies": 11 },
          { "name": "Luis Carniglia",       "flag": "argentina",   "country": "Argentina",   "period": "1957–1959",    "note": "Back-to-back European Cups",    "trophies": 4 },
          { "name": "José Villalonga",      "flag": "spain",       "country": "Spain",       "period": "1954–1957",    "note": "First manager in modern era",   "trophies": 2 }
        ]
      },
      "presidents": {
        "summary": {
          "total": "11",
          "longest": "Santiago Bernabéu",
          "longestDesc": "35 years · 1943–1978",
          "current": "Florentino Pérez",
          "currentDesc": "Since June 2009",
          "mostTrophies": "Florentino Pérez",
          "mostTrophiesDesc": "6 UCL · 5 La Liga"
        },
        "list": [
          { "name": "Florentino Pérez",        "flag": "spain", "country": "Spain", "period": "2009–present", "periodDate": "1 June 2009 – Present",           "achievements": "6 UCL, 5 La Liga, 2 Copa del Rey, Galácticos 2.0", "current": true },
          { "name": "Vicente Boluda",          "flag": "spain", "country": "Spain", "period": "2009",         "periodDate": "16 January 2009 – 31 May 2009",   "achievements": "Interim President" },
          { "name": "Ramón Calderón",          "flag": "spain", "country": "Spain", "period": "2006–2009",    "periodDate": "2 July 2006 – 16 January 2009",   "achievements": "2 La Liga" },
          { "name": "Fernando Martín Álvarez", "flag": "spain", "country": "Spain", "period": "2006",         "periodDate": "27 February 2006 – 26 April 2006","achievements": "Interim President" },
          { "name": "Florentino Pérez",        "flag": "spain", "country": "Spain", "period": "2000–2006",    "periodDate": "17 July 2000 – 27 February 2006", "achievements": "2 UCL, 2 La Liga, 1 Intercontinental Cup, Galácticos era" },
          { "name": "Lorenzo Sanz",            "flag": "spain", "country": "Spain", "period": "1995–2000",    "periodDate": "26 November 1995 – 17 July 2000", "achievements": "2 UCL, 1 La Liga, 1 Intercontinental Cup" },
          { "name": "Ramón Mendoza",           "flag": "spain", "country": "Spain", "period": "1985–1995",    "periodDate": "24 May 1985 – 26 November 1995",  "achievements": "6 La Liga, 2 UEFA Cups" },
          { "name": "Luis de Carlos",          "flag": "spain", "country": "Spain", "period": "1978–1985",    "periodDate": "1 September 1978 – 24 May 1985",  "achievements": "2 La Liga, 2 Copa del Rey" },
          { "name": "Santiago Bernabéu",       "flag": "spain", "country": "Spain", "period": "1943–1978",    "periodDate": "15 September 1943 – 2 June 1978", "achievements": "6 European Cups, 16 La Liga, transformed Real Madrid into a global giant" },
          { "name": "Antonio Santos Peralba",  "flag": "spain", "country": "Spain", "period": "1943",         "periodDate": "1 January 1943 – 15 September 1943", "achievements": "Interim President" },
          { "name": "Adolfo Meléndez",         "flag": "spain", "country": "Spain", "period": "1940–1943",    "periodDate": "1 January 1940 – 1 January 1943", "achievements": "1 Copa del Rey" }
        ]
      }
    },
  
    "records": [
      { "label": "Most appearances (all competitions)", "value": "Raúl González — 741" },
      { "label": "Most goals (all competitions)", "value": "Cristiano Ronaldo — 450" },
      { "label": "Most goals in a single season", "value": "Cristiano Ronaldo — 61 (2014–15)" },
      { "label": "Most trophies won (player)", "value": "Marcelo — 25" },
      { "label": "Most Champions League titles (player)", "value": "Luka Modrić, Dani Carvajal, Nacho, Toni Kroos — 6" },
      { "label": "Most European Cup titles (club)", "value": "15 (world record)" },
      { "label": "Most La Liga titles (club)", "value": "36 (Spanish record)" },
      { "label": "Biggest win (La Liga)", "value": "Real Madrid 11–1 Elche (1959–60)" },
      { "label": "Biggest win (European competition)", "value": "Real Madrid 11–0 B 1909 (1961–62)" },
      { "label": "Longest unbeaten run", "value": "40 matches (2016–2017)" },
      { "label": "Consecutive European Cup wins", "value": "5 (1956–1960, world record)" },
      { "label": "Most Champions League titles won consecutively", "value": "3 (2016, 2017, 2018)" },
      { "label": "Most expensive signing", "value": "Kylian Mbappé — Free (2024)" }
    ],
  
    "players": [
      { "slug": "cristiano-ronaldo", "name": "Cristiano Ronaldo", "yearsData": [2009, 2018], "years": "2009–2018", "flag": "portugal",  "country": "Portugal" },
      { "slug": "ronaldo-nazario",   "name": "Ronaldo Nazário",   "yearsData": [2002, 2007], "years": "2002–2007", "flag": "brazil",    "country": "Brazil" },
      { "slug": "gareth-bale",       "name": "Gareth Bale",       "yearsData": [2013, 2022], "years": "2013–2022", "flag": "wales",     "country": "Wales" },
      { "slug": "di-maria",          "name": "Ángel Di María",    "yearsData": [2010, 2014], "years": "2010–2014", "flag": "argentina", "country": "Argentina" },
      { "slug": "sergio-ramos",      "name": "Sergio Ramos",      "yearsData": [2005, 2021], "years": "2005–2021", "flag": "spain",     "country": "Spain" },
      { "slug": "toni-kroos",        "name": "Toni Kroos",        "yearsData": [2014, 2024], "years": "2014–2024", "flag": "germany",   "country": "Germany" },
      { "slug": "luka-modric",       "name": "Luka Modrić",       "yearsData": [2012, 2025], "years": "2012–2025", "flag": "croatia",   "country": "Croatia" },
      { "slug": "iker-casillas",     "name": "Iker Casillas",     "yearsData": [1999, 2015], "years": "1999–2015", "flag": "spain",     "country": "Spain" },
      { "slug": "thibaut-courtois",  "name": "Thibaut Courtois",  "yearsData": [2018, null], "years": "2018–present", "flag": "belgium","country": "Belgium" },
      { "slug": "rodrygo",           "name": "Rodrygo",           "yearsData": [2019, null], "years": "2019–present", "flag": "brazil", "country": "Brazil" },
      { "slug": "zinedine-zidane",   "name": "Zinédine Zidane",   "yearsData": [2001, 2006], "years": "2001–2006", "flag": "france",    "country": "France" }
    ],
  
    "transfers": {
      "summary": {
        "totalIn": "€47.5M",
        "totalOut": "€0",
        "netSpend": "−€47.5M",
        "latestPlayer": "Kylian Mbappé",
        "latestDesc": "Free · from Paris Saint-Germain · 2024"
      },
      "latest": [
        {
          "player": "Kylian Mbappé",
          "playerSlug": "kylian-mbappe",
          "flag": "france",
          "country": "France",
          "position": "Forward",
          "direction": "in",
          "from": "Paris Saint-Germain",
          "fromSlug": "psg",
          "to": "Real Madrid",
          "toSlug": "real-madrid",
          "fee": "Free",
          "feeValue": 0,
          "date": "2024-07-01",
          "type": "Free transfer"
        },
        {
          "player": "Endrick",
          "playerSlug": "endrick",
          "flag": "brazil",
          "country": "Brazil",
          "position": "Forward",
          "direction": "in",
          "from": "Palmeiras",
          "fromSlug": "palmeiras",
          "to": "Real Madrid",
          "toSlug": "real-madrid",
          "fee": "€47.5M",
          "feeValue": 47500000,
          "date": "2024-07-21",
          "type": "Permanent"
        },
        {
          "player": "Nacho Fernández",
          "playerSlug": "nacho",
          "flag": "spain",
          "country": "Spain",
          "position": "Defender",
          "direction": "out",
          "from": "Real Madrid",
          "fromSlug": "real-madrid",
          "to": "Al-Qadsiah",
          "toSlug": "al-qadsiah",
          "fee": "Free",
          "feeValue": 0,
          "date": "2024-07-01",
          "type": "Free transfer"
        }
      ]
    },
  
    "info": {
      "intro": "Key facts about Real Madrid."
    },
  
    "ownership": {
      "title": "Member-Owned Club",
      "paragraphs": [
        "Real Madrid is <strong>100% owned by its members (socios)</strong> — approximately <strong>100,000 people</strong> worldwide who pay an annual membership fee and hold voting rights.",
        "Unlike most major clubs, Real Madrid has <strong>no shareholders, no external investors, and no stock listing</strong>. The president is elected by the socios every four years. This makes Real Madrid one of the few remaining member-owned clubs at the top of world football."
      ]
    }
  };