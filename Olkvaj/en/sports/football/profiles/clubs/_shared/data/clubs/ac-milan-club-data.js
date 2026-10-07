/* ============================================================
   OLKVAJ — Club data: AC Milan
   Location: sports/football/profiles/clubs/_shared/data/clubs/ac-milan-club-data.js
   ============================================================ */

   window.__CLUB_DATA__ = {
    "slug": "ac-milan",
    "name": "AC Milan",
    "fullName": "Associazione Calcio Milan",
    "founded": 1899,
    "city": "Milan",
    "country": "italy",
    "countryName": "Italy",
    "league": "Serie A",
    "logoSlug": "ac-milan",
    "nicknames": ["I Rossoneri", "Il Diavolo"],
    "colours": ["Red", "Black"],
    "lastUpdated": "September 2026",
  
    "overview": {
      "stats": [
        { "year": 1899, "label": "Founded" },
        { "value": "50", "label": "Total<br>Trophies" },
        { "value": "7",  "label": "European<br>Cups" },
        { "value": "19", "label": "League<br>Titles" }
      ],
      "paragraphs": [
        "Associazione Calcio Milan, commonly referred to as AC Milan or simply Milan, is an Italian professional football club based in Milan, Lombardy. Founded in 1899 by Englishman Herbert Kilpin and Alfred Edwards, the club has spent its entire history in the top flight of Italian football and has worn red-and-black striped shirts since its foundation \u2014 giving rise to the nickname I Rossoneri (\"The Red and Blacks\").",
        "Milan is one of the most successful clubs in world football, having won a record-tying 19 Serie A titles, 7 European Cups/UEFA Champions League titles, and 50 major trophies in total. The club's golden eras span the Arrigo Sacchi and Fabio Capello teams of the late 1980s and 1990s \u2014 built around the Dutch trio of Marco van Basten, Ruud Gullit and Frank Rijkaard \u2014 the Carlo Ancelotti era of the 2000s featuring Kak\u00e1, Andrea Pirlo and Paolo Maldini, and the recent Scudetto of 2022 under Stefano Pioli. AC Milan share the San Siro with city rivals Inter and contest the Derby della Madonnina, one of world football's fiercest local rivalries."
      ]
    },
  
    "totalTrophies": 50,
  
    "honours": [
      { "competition": "Serie A", "count": 19, "note": "Last won 2022", "hero": true },
      { "competition": "European Cup / Champions League", "count": 7, "note": "Last won 2007", "hero": true },
      { "competition": "Coppa Italia", "count": 5, "note": "Last won 2003", "hero": false },
      { "competition": "Supercoppa Italiana", "count": 8, "note": "Last won 2024", "hero": false },
      { "competition": "UEFA Cup Winners' Cup", "count": 2, "note": "1968, 1973", "hero": false },
      { "competition": "UEFA Super Cup", "count": 5, "note": "Last won 2007", "hero": false },
      { "competition": "Intercontinental Cup / FIFA Club World Cup", "count": 4, "note": "Last won 2007", "hero": false }
    ],
  
    "finance": {
      "intro": "AC Milan's financial overview \u2014 revenue streams, expense breakdown, commercial partnerships, and historical net profit/loss. All figures are in euros (\u20ac).",
      "netProfit": "+\u20ac32M",
  
      "revenue": {
        "total": "\u20ac457M",
        "totalYoy": "+2.7%",
        "pieGradient": "conic-gradient(#16a34a 0deg 151.2deg, #22c55e 151.2deg 277.2deg, #4ade80 277.2deg 342deg, #86efac 342deg 360deg)",
        "streams": [
          { "label": "Commercial & Sponsorship", "className": "commercial", "color": "#16a34a", "pct": "42%", "pctWidth": "42%", "amount": "\u20ac192M", "yoy": "+6.8%", "yoyDir": "up", "description": "Main sponsor, kit deal, training kit, retail, licensing", "tooltip": "Bundles the Puma kit deal, Emirates main shirt sponsorship, Banco BPM back-of-shirt deal, Bitpanda training kit partnership, and the club's retail and licensing operation." },
          { "label": "Broadcasting Rights", "className": "broadcasting", "color": "#22c55e", "pct": "35%", "pctWidth": "35%", "amount": "\u20ac160M", "yoy": "+4.2%", "yoyDir": "up", "description": "Serie A TV deal, UEFA Champions League pool, international rights", "tooltip": "Includes Serie A's collective domestic TV deal, UEFA Champions League pool distribution, and international broadcast rights. Milan's return to the UCL deep stages drove the recent uplift." },
          { "label": "Matchday Revenue", "className": "matchday", "color": "#4ade80", "pct": "18%", "pctWidth": "18%", "amount": "\u20ac82M", "yoy": "+22.4%", "yoyDir": "up", "description": "San Siro ticket sales, hospitality, museum, tours", "tooltip": "Ticket sales, hospitality boxes, San Siro museum, and stadium tours. Boosted by strong attendance and increased hospitality demand." },
          { "label": "Other", "className": "other", "color": "#86efac", "pct": "5%", "pctWidth": "5%", "amount": "\u20ac23M", "yoy": "\u22125.1%", "yoyDir": "down", "description": "Player sales, non-football events, media", "tooltip": "Transfer profits, non-football events at the San Siro, and club media/content revenue." }
        ],
        "summary": {
          "season": "2024\u201325 season",
          "largest": "Commercial",
          "largestDesc": "\u20ac192M \u00b7 42% of total",
          "fastest": "Matchday",
          "fastestDesc": "+22.4% YoY \u00b7 Attendance growth",
          "perStream": "\u20ac114M",
          "perStreamDesc": "Average across 4 streams"
        },
        "notes": [
          { "title": "Commercial anchor.", "body": "Puma's kit deal and Emirates' shirt sponsorship together account for roughly 30% of total commercial revenue. Both deals were renewed in the last five years and run through 2027+" },
          { "title": "Matchday surge.", "body": "The +22.4% YoY growth reflects consistently packed San Siro crowds and expanded hospitality offerings, plus increased stadium tour revenue." },
          { "title": "Broadcasting ceiling.", "body": "Like Real Madrid, Milan's broadcast revenue growth is capped by Serie A's collective TV deal. Performance in the Champions League drives most of the YoY uplift here." },
          { "title": "Other revenue dip.", "body": "The \u22125.1% decline reflects fewer high-value player sales compared to the prior season." }
        ]
      },
  
      "expenses": {
        "total": "\u20ac425M",
        "totalYoy": "+2.4%",
        "pieGradient": "conic-gradient(#dc2626 0deg 172.8deg, #ef4444 172.8deg 288deg, #f87171 288deg 338.4deg, #fca5a5 338.4deg 360deg)",
        "categories": [
          { "label": "Player Wages & Salaries", "className": "wages", "color": "#dc2626", "pct": "48%", "pctWidth": "48%", "amount": "\u20ac204M", "yoy": "+3.1%", "yoyDir": "up", "description": "First-team squad, coaching staff, bonuses", "tooltip": "First-team squad salaries, coaching staff wages, image rights payments, performance bonuses, and severance payments." },
          { "label": "Operations & Admin", "className": "operations", "color": "#ef4444", "pct": "32%", "pctWidth": "32%", "amount": "\u20ac136M", "yoy": "+1.5%", "yoyDir": "up", "description": "Club staff, day-to-day operations, youth academy", "tooltip": "Non-playing club staff, day-to-day operations, administrative costs, scouting, and the running costs of the Milanello training complex." },
          { "label": "Stadium & Infrastructure", "className": "stadium", "color": "#f87171", "pct": "14%", "pctWidth": "14%", "amount": "\u20ac60M", "yoy": "+18.2%", "yoyDir": "up", "description": "San Siro operations, Milanello, infrastructure", "tooltip": "San Siro stadium operations (shared with Inter), Milanello training facility costs, and infrastructure investments." },
          { "label": "Other", "className": "other", "color": "#fca5a5", "pct": "6%", "pctWidth": "6%", "amount": "\u20ac25M", "yoy": "\u22123.8%", "yoyDir": "down", "description": "Transfer amortization, misc. expenses", "tooltip": "Transfer fee amortization, agent fees, and miscellaneous legal and compliance costs." }
        ],
        "summary": {
          "season": "2024\u201325 season",
          "largest": "Wages",
          "largestDesc": "\u20ac204M \u00b7 48% of total",
          "fastest": "Stadium",
          "fastestDesc": "+18.2% YoY \u00b7 Infrastructure",
          "perCategory": "\u20ac106M",
          "perCategoryDesc": "Average across 4 categories"
        },
        "notes": [
          { "title": "Wage discipline.", "body": "At 48% of total expenses and 44.6% of revenue, Milan's wage bill sits comfortably within UEFA's Financial Sustainability framework." },
          { "title": "Stadium cost surge.", "body": "The +18.2% YoY jump reflects higher San Siro operating costs and ongoing infrastructure investments at Milanello." },
          { "title": "Operations scale.", "body": "Elevated by the club's extensive commercial operations and youth academy." },
          { "title": "Transfer amortization decline.", "body": "The \u22123.8% drop reflects the completion of amortization on several older signings." }
        ]
      },
  
      "sponsors": {
        "list": [
          { "name": "Puma", "logo": "PU", "category": "sportswear", "subCategory": "Kit Manufacturer", "scope": "Global", "className": "kit", "since": "2018 \u00b7 8 yrs", "durationWidth": "28%", "value": "~\u20ac30M" },
          { "name": "Emirates", "logo": "EK", "category": "shirt", "subCategory": "Main Shirt Sponsor", "scope": "Global", "className": "shirt", "since": "2010 \u00b7 16 yrs", "durationWidth": "54%", "value": "~\u20ac30M" },
          { "name": "BMW", "logo": "BMW", "category": "automotive", "subCategory": "Automotive Partner", "scope": "Regional", "className": "automotive", "since": "2021 \u00b7 5 yrs", "durationWidth": "18%", "value": "~\u20ac12M" },
          { "name": "Banco BPM", "logo": "BPM", "category": "shirt", "subCategory": "Back of Shirt", "scope": "Regional", "className": "shirt", "since": "2022 \u00b7 4 yrs", "durationWidth": "14%", "value": "~\u20ac8M" },
          { "name": "Bitpanda", "logo": "BIT", "category": "technology", "subCategory": "Training Kit Partner", "scope": "Global", "className": "tech", "since": "2021 \u00b7 5 yrs", "durationWidth": "18%", "value": "~\u20ac10M" },
          { "name": "Lete", "logo": "LT", "category": "beverage", "subCategory": "Water Partner", "scope": "Regional", "className": "beverage", "since": "2019 \u00b7 7 yrs", "durationWidth": "25%", "value": "~\u20ac5M" },
          { "name": "Nivea Men", "logo": "NV", "category": "service", "subCategory": "Personal Care Partner", "scope": "Regional", "className": "service", "since": "2016 \u00b7 10 yrs", "durationWidth": "36%", "value": "~\u20ac6M" },
          { "name": "EA Sports", "logo": "EA", "category": "technology", "subCategory": "Gaming Partner", "scope": "Global", "className": "tech", "since": "2020 \u00b7 6 yrs", "durationWidth": "21%", "value": "~\u20ac8M" },
          { "name": "Sanpellegrino", "logo": "SP", "category": "beverage", "subCategory": "Beverage Partner", "scope": "Regional", "className": "beverage", "since": "2018 \u00b7 8 yrs", "durationWidth": "28%", "value": "~\u20ac3M" },
          { "name": "Frecciarossa", "logo": "FR", "category": "service", "subCategory": "Travel Partner", "scope": "Regional", "className": "service", "since": "2020 \u00b7 6 yrs", "durationWidth": "21%", "value": "~\u20ac4M" },
          { "name": "Cisalfa Sport", "logo": "CS", "category": "service", "subCategory": "Retail Partner", "scope": "Regional", "className": "service", "since": "2022 \u00b7 4 yrs", "durationWidth": "14%", "value": "~\u20ac3M" },
          { "name": "Intimissimi Uomo", "logo": "IN", "category": "service", "subCategory": "Formal Wear Partner", "scope": "Regional", "className": "service", "since": "2017 \u00b7 9 yrs", "durationWidth": "32%", "value": "~\u20ac2M" }
        ],
        "timeline": {
          "title": "Partnership timeline \u2014 2000 to present",
          "years": [
            { "left": "0%",   "label": "2000" },
            { "left": "20%",  "label": "2005" },
            { "left": "40%",  "label": "2010" },
            { "left": "60%",  "label": "2015" },
            { "left": "80%",  "label": "2020" },
            { "left": "100%", "label": "2025" }
          ],
          "rows": [
            { "name": "Puma",              "className": "kit",        "left": "72%",   "width": "28%", "title": "2018\u2013present" },
            { "name": "Emirates",          "className": "shirt",      "left": "40%",   "width": "60%", "title": "2010\u2013present" },
            { "name": "BMW",               "className": "automotive", "left": "84%",   "width": "16%", "title": "2021\u2013present" },
            { "name": "Banco BPM",         "className": "shirt",      "left": "88%",   "width": "12%", "title": "2022\u2013present" },
            { "name": "Bitpanda",          "className": "tech",       "left": "84%",   "width": "16%", "title": "2021\u2013present" },
            { "name": "Lete",              "className": "beverage",   "left": "76%",   "width": "24%", "title": "2019\u2013present" },
            { "name": "Nivea Men",         "className": "service",    "left": "64%",   "width": "36%", "title": "2016\u2013present" },
            { "name": "EA Sports",         "className": "tech",       "left": "80%",   "width": "20%", "title": "2020\u2013present" },
            { "name": "Sanpellegrino",     "className": "beverage",   "left": "72%",   "width": "28%", "title": "2018\u2013present" },
            { "name": "Frecciarossa",      "className": "service",    "left": "80%",   "width": "20%", "title": "2020\u2013present" },
            { "name": "Cisalfa Sport",     "className": "service",    "left": "88%",   "width": "12%", "title": "2022\u2013present" },
            { "name": "Intimissimi Uomo",  "className": "service",    "left": "68%",   "width": "32%", "title": "2017\u2013present" }
          ]
        },
        "summary": {
          "season": "2024\u201325",
          "totalPartners": "12",
          "totalPartnersDesc": "Active in 2024\u201325",
          "longest": "Emirates",
          "longestDesc": "16 years \u00b7 since 2010",
          "newest": "Banco BPM \u00b7 Cisalfa",
          "newestDesc": "4 years \u00b7 since 2022",
          "totalValue": "\u20ac192M",
          "totalValueDesc": "Commercial revenue 2024\u201325",
          "totalEstValue": "~\u20ac120M"
        },
        "notes": [
          { "title": "Puma is the anchor.", "body": "The kit deal signed in 2018 replaced Adidas and is reportedly worth around \u20ac30M per season through 2028." },
          { "title": "Emirates longevity.", "body": "The main shirt sponsor since 2010, Emirates renewed in 2023 through 2027. One of the longest-running shirt sponsorships in world football." },
          { "title": "Back-of-shirt revenue.", "body": "Banco BPM's back-of-shirt deal (2022) added a new category of inventory that barely existed a decade ago." },
          { "title": "Estimated values.", "body": "Annual value figures are estimates based on public reporting and industry benchmarks." }
        ]
      },
  
      "history": {
        "chartTitle": "Net Profit (\u20acM) \u2014 26 Seasons Trend",
        "seasons": [
          { "season": "2000\u201301", "shortLabel": "00/01", "revenue": "\u20ac133M", "expenses": "\u20ac125M", "profit": 8,   "profitDisplay": "+\u20ac8M",  "profitMargin": "6.0%",  "revenueGrowth": "\u2014",     "rollingAvg": "+\u20ac8M",   "trend": "\u2014",      "yoy": "\u2014" },
          { "season": "2001\u201302", "shortLabel": "01/02", "revenue": "\u20ac145M", "expenses": "\u20ac137M", "profit": 8,   "profitDisplay": "+\u20ac8M",  "profitMargin": "5.5%",  "revenueGrowth": "+9.0%",  "rollingAvg": "+\u20ac8M",   "trend": "0%",     "yoy": "0%" },
          { "season": "2002\u201303", "shortLabel": "02/03", "revenue": "\u20ac168M", "expenses": "\u20ac155M", "profit": 13,  "profitDisplay": "+\u20ac13M", "profitMargin": "7.7%",  "revenueGrowth": "+15.9%", "rollingAvg": "+\u20ac10M",  "trend": "+62.5%", "yoy": "+62.5%" },
          { "season": "2003\u201304", "shortLabel": "03/04", "revenue": "\u20ac195M", "expenses": "\u20ac178M", "profit": 17,  "profitDisplay": "+\u20ac17M", "profitMargin": "8.7%",  "revenueGrowth": "+16.1%", "rollingAvg": "+\u20ac13M",  "trend": "+30.8%", "yoy": "+30.8%" },
          { "season": "2004\u201305", "shortLabel": "04/05", "revenue": "\u20ac215M", "expenses": "\u20ac197M", "profit": 18,  "profitDisplay": "+\u20ac18M", "profitMargin": "8.4%",  "revenueGrowth": "+10.3%", "rollingAvg": "+\u20ac16M",  "trend": "+5.9%",  "yoy": "+5.9%" },
          { "season": "2005\u201306", "shortLabel": "05/06", "revenue": "\u20ac230M", "expenses": "\u20ac210M", "profit": 20,  "profitDisplay": "+\u20ac20M", "profitMargin": "8.7%",  "revenueGrowth": "+7.0%",  "rollingAvg": "+\u20ac18M",  "trend": "+11.1%", "yoy": "+11.1%" },
          { "season": "2006\u201307", "shortLabel": "06/07", "revenue": "\u20ac245M", "expenses": "\u20ac228M", "profit": 17,  "profitDisplay": "+\u20ac17M", "profitMargin": "6.9%",  "revenueGrowth": "+6.5%",  "rollingAvg": "+\u20ac18M",  "trend": "\u221215%", "yoy": "\u221215%" },
          { "season": "2007\u201308", "shortLabel": "07/08", "revenue": "\u20ac262M", "expenses": "\u20ac243M", "profit": 19,  "profitDisplay": "+\u20ac19M", "profitMargin": "7.3%",  "revenueGrowth": "+6.9%",  "rollingAvg": "+\u20ac19M",  "trend": "+11.8%", "yoy": "+11.8%" },
          { "season": "2008\u201309", "shortLabel": "08/09", "revenue": "\u20ac255M", "expenses": "\u20ac240M", "profit": 15,  "profitDisplay": "+\u20ac15M", "profitMargin": "5.9%",  "revenueGrowth": "\u22122.7%", "rollingAvg": "+\u20ac17M",  "trend": "\u221221.1%", "yoy": "\u221221.1%" },
          { "season": "2009\u201310", "shortLabel": "09/10", "revenue": "\u20ac242M", "expenses": "\u20ac238M", "profit": 4,   "profitDisplay": "+\u20ac4M",  "profitMargin": "1.7%",  "revenueGrowth": "\u22125.1%", "rollingAvg": "+\u20ac13M",  "trend": "\u221273.3%", "yoy": "\u221273.3%" },
          { "season": "2010\u201311", "shortLabel": "10/11", "revenue": "\u20ac245M", "expenses": "\u20ac250M", "profit": -5,  "profitDisplay": "\u2212\u20ac5M",  "profitMargin": "\u22122.0%", "revenueGrowth": "+1.2%",  "rollingAvg": "+\u20ac5M",   "trend": "\u2212225%",  "yoy": "\u2212225%" },
          { "season": "2011\u201312", "shortLabel": "11/12", "revenue": "\u20ac240M", "expenses": "\u20ac255M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.3%", "revenueGrowth": "\u22122.0%", "rollingAvg": "\u2212\u20ac5M",  "trend": "\u2212200%",  "yoy": "\u2212200%" },
          { "season": "2012\u201313", "shortLabel": "12/13", "revenue": "\u20ac245M", "expenses": "\u20ac260M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.1%", "revenueGrowth": "+2.1%",  "rollingAvg": "\u2212\u20ac12M", "trend": "0%",     "yoy": "0%" },
          { "season": "2013\u201314", "shortLabel": "13/14", "revenue": "\u20ac250M", "expenses": "\u20ac258M", "profit": -8,  "profitDisplay": "\u2212\u20ac8M",  "profitMargin": "\u22123.2%", "revenueGrowth": "+2.0%",  "rollingAvg": "\u2212\u20ac13M", "trend": "+46.7%", "yoy": "+46.7%" },
          { "season": "2014\u201315", "shortLabel": "14/15", "revenue": "\u20ac225M", "expenses": "\u20ac250M", "profit": -25, "profitDisplay": "\u2212\u20ac25M", "profitMargin": "\u221211.1%","revenueGrowth": "\u221210.0%","rollingAvg": "\u2212\u20ac16M", "trend": "\u2212212.5%","yoy": "\u2212212.5%" },
          { "season": "2015\u201316", "shortLabel": "15/16", "revenue": "\u20ac220M", "expenses": "\u20ac245M", "profit": -25, "profitDisplay": "\u2212\u20ac25M", "profitMargin": "\u221211.4%","revenueGrowth": "\u22122.2%", "rollingAvg": "\u2212\u20ac19M", "trend": "0%",     "yoy": "0%" },
          { "season": "2016\u201317", "shortLabel": "16/17", "revenue": "\u20ac225M", "expenses": "\u20ac240M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.7%", "revenueGrowth": "+2.3%",  "rollingAvg": "\u2212\u20ac22M", "trend": "+40%",   "yoy": "+40%" },
          { "season": "2017\u201318", "shortLabel": "17/18", "revenue": "\u20ac248M", "expenses": "\u20ac262M", "profit": -14, "profitDisplay": "\u2212\u20ac14M", "profitMargin": "\u22125.6%", "revenueGrowth": "+10.2%", "rollingAvg": "\u2212\u20ac18M", "trend": "+6.7%",  "yoy": "+6.7%" },
          { "season": "2018\u201319", "shortLabel": "18/19", "revenue": "\u20ac260M", "expenses": "\u20ac268M", "profit": -8,  "profitDisplay": "\u2212\u20ac8M",  "profitMargin": "\u22123.1%", "revenueGrowth": "+4.8%",  "rollingAvg": "\u2212\u20ac12M", "trend": "+42.9%", "yoy": "+42.9%" },
          { "season": "2019\u201320", "shortLabel": "19/20", "revenue": "\u20ac220M", "expenses": "\u20ac240M", "profit": -20, "profitDisplay": "\u2212\u20ac20M", "profitMargin": "\u22129.1%", "revenueGrowth": "\u221215.4%","rollingAvg": "\u2212\u20ac14M", "trend": "\u2212150%",  "yoy": "\u2212150%" },
          { "season": "2020\u201321", "shortLabel": "20/21", "revenue": "\u20ac225M", "expenses": "\u20ac245M", "profit": -20, "profitDisplay": "\u2212\u20ac20M", "profitMargin": "\u22128.9%", "revenueGrowth": "+2.3%",  "rollingAvg": "\u2212\u20ac16M", "trend": "0%",     "yoy": "0%" },
          { "season": "2021\u201322", "shortLabel": "21/22", "revenue": "\u20ac270M", "expenses": "\u20ac275M", "profit": -5,  "profitDisplay": "\u2212\u20ac5M",  "profitMargin": "\u22121.9%", "revenueGrowth": "+20.0%", "rollingAvg": "\u2212\u20ac15M", "trend": "+75%",   "yoy": "+75%" },
          { "season": "2022\u201323", "shortLabel": "22/23", "revenue": "\u20ac380M", "expenses": "\u20ac355M", "profit": 25,  "profitDisplay": "+\u20ac25M", "profitMargin": "6.6%",  "revenueGrowth": "+40.7%", "rollingAvg": "\u20ac0M",    "trend": "+600%",  "yoy": "+600%" },
          { "season": "2023\u201324", "shortLabel": "23/24", "revenue": "\u20ac445M", "expenses": "\u20ac415M", "profit": 30,  "profitDisplay": "+\u20ac30M", "profitMargin": "6.7%",  "revenueGrowth": "+17.1%", "rollingAvg": "+\u20ac17M",  "trend": "+20%",   "yoy": "+20%" },
          { "season": "2024\u201325", "shortLabel": "24/25", "revenue": "\u20ac457M", "expenses": "\u20ac425M", "profit": 32,  "profitDisplay": "+\u20ac32M", "profitMargin": "7.0%",  "revenueGrowth": "+2.7%",  "rollingAvg": "+\u20ac29M",  "trend": "+6.7%",  "yoy": "+6.7%" },
          { "season": "2025\u201326", "shortLabel": "25/26", "revenue": "\u20ac475M", "expenses": "\u20ac440M", "profit": 35,  "profitDisplay": "+\u20ac35M", "profitMargin": "7.4%",  "revenueGrowth": "+3.9%",  "rollingAvg": "+\u20ac32M",  "trend": "+9.4%",  "yoy": "+9.4%" }
        ],
        "summary": {
          "title": "26-Season Summary (2000\u20132026)",
          "totalProfit": "+\u20ac86M",
          "totalProfitLabel": "Total Profit<br>(26 seasons)",
          "totalProfitTooltip": "Total net profit accumulated across all 26 seasons (2000\u201301 to 2025\u201326).",
          "bestYear": "+\u20ac35M",
          "bestYearLabel": "Best Year<br>2025\u201326",
          "bestYearTooltip": "The single season with the highest net profit. Best year was 2025\u201326 with +\u20ac35M.",
          "worstYear": "\u2212\u20ac25M",
          "worstYearLabel": "Worst Year<br>2014\u201315",
          "worstYearTooltip": "The single season with the lowest net result. Worst year was 2014\u201315 with \u2212\u20ac25M.",
          "avgProfit": "+\u20ac3.3M",
          "avgLabel": "Avg Net Profit<br>per Season",
          "avgTooltip": "Arithmetic mean of net profit across all 26 seasons.",
          "profitable": "14 / 26",
          "profitableLabel": "Profitable<br>Seasons",
          "profitableTooltip": "14 of 26 seasons ended profitable. The 2010s were the club's most challenging financial decade."
        },
        "analytics": {
          "revenueCagr": "+5.2%",
          "revenueCagrDesc": "From \u20ac133M (2000) to \u20ac475M (2025)",
          "expensesCagr": "+5.2%",
          "expensesCagrDesc": "From \u20ac125M (2000) to \u20ac440M (2025)",
          "wageRevenue": "44.6%",
          "wageRevenueDesc": "\u20ac204M wages \u00f7 \u20ac457M revenue (2024\u201325)",
          "profitMargin": "7.0%",
          "profitMarginDesc": "\u20ac32M profit \u00f7 \u20ac457M revenue (2024\u201325)"
        },
        "decades": [
          {
            "title": "2020s",
            "total": "+\u20ac97M",
            "seasons": [
              { "season": "2025\u201326", "revenue": "\u20ac475M", "expenses": "\u20ac440M", "profit": 35,  "profitDisplay": "+\u20ac35M", "profitMargin": "7.4%",  "revenueGrowth": "+3.9%",  "rollingAvg": "+\u20ac32M",  "trend": "+9.4%",  "yoy": "+9.4%" },
              { "season": "2024\u201325", "revenue": "\u20ac457M", "expenses": "\u20ac425M", "profit": 32,  "profitDisplay": "+\u20ac32M", "profitMargin": "7.0%",  "revenueGrowth": "+2.7%",  "rollingAvg": "+\u20ac29M",  "trend": "+6.7%",  "yoy": "+6.7%" },
              { "season": "2023\u201324", "revenue": "\u20ac445M", "expenses": "\u20ac415M", "profit": 30,  "profitDisplay": "+\u20ac30M", "profitMargin": "6.7%",  "revenueGrowth": "+17.1%", "rollingAvg": "+\u20ac17M",  "trend": "+20%",   "yoy": "+20%" },
              { "season": "2022\u201323", "revenue": "\u20ac380M", "expenses": "\u20ac355M", "profit": 25,  "profitDisplay": "+\u20ac25M", "profitMargin": "6.6%",  "revenueGrowth": "+40.7%", "rollingAvg": "\u20ac0M",    "trend": "+600%",  "yoy": "+600%" },
              { "season": "2021\u201322", "revenue": "\u20ac270M", "expenses": "\u20ac275M", "profit": -5,  "profitDisplay": "\u2212\u20ac5M",  "profitMargin": "\u22121.9%", "revenueGrowth": "+20.0%", "rollingAvg": "\u2212\u20ac15M", "trend": "+75%",   "yoy": "+75%" },
              { "season": "2020\u201321", "revenue": "\u20ac225M", "expenses": "\u20ac245M", "profit": -20, "profitDisplay": "\u2212\u20ac20M", "profitMargin": "\u22128.9%", "revenueGrowth": "+2.3%",  "rollingAvg": "\u2212\u20ac16M", "trend": "0%",     "yoy": "0%" }
            ]
          },
          {
            "title": "2010s",
            "total": "\u2212\u20ac150M",
            "seasons": [
              { "season": "2019\u201320", "revenue": "\u20ac220M", "expenses": "\u20ac240M", "profit": -20, "profitDisplay": "\u2212\u20ac20M", "profitMargin": "\u22129.1%", "revenueGrowth": "\u221215.4%", "rollingAvg": "\u2212\u20ac14M", "trend": "\u2212150%", "yoy": "\u2212150%" },
              { "season": "2018\u201319", "revenue": "\u20ac260M", "expenses": "\u20ac268M", "profit": -8,  "profitDisplay": "\u2212\u20ac8M",  "profitMargin": "\u22123.1%", "revenueGrowth": "+4.8%",  "rollingAvg": "\u2212\u20ac12M", "trend": "+42.9%", "yoy": "+42.9%" },
              { "season": "2017\u201318", "revenue": "\u20ac248M", "expenses": "\u20ac262M", "profit": -14, "profitDisplay": "\u2212\u20ac14M", "profitMargin": "\u22125.6%", "revenueGrowth": "+10.2%", "rollingAvg": "\u2212\u20ac18M", "trend": "+6.7%",  "yoy": "+6.7%" },
              { "season": "2016\u201317", "revenue": "\u20ac225M", "expenses": "\u20ac240M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.7%", "revenueGrowth": "+2.3%",  "rollingAvg": "\u2212\u20ac22M", "trend": "+40%",   "yoy": "+40%" },
              { "season": "2015\u201316", "revenue": "\u20ac220M", "expenses": "\u20ac245M", "profit": -25, "profitDisplay": "\u2212\u20ac25M", "profitMargin": "\u221211.4%","revenueGrowth": "\u22122.2%", "rollingAvg": "\u2212\u20ac19M", "trend": "0%",     "yoy": "0%" },
              { "season": "2014\u201315", "revenue": "\u20ac225M", "expenses": "\u20ac250M", "profit": -25, "profitDisplay": "\u2212\u20ac25M", "profitMargin": "\u221211.1%","revenueGrowth": "\u221210.0%","rollingAvg": "\u2212\u20ac16M", "trend": "\u2212212.5%","yoy": "\u2212212.5%" },
              { "season": "2013\u201314", "revenue": "\u20ac250M", "expenses": "\u20ac258M", "profit": -8,  "profitDisplay": "\u2212\u20ac8M",  "profitMargin": "\u22123.2%", "revenueGrowth": "+2.0%",  "rollingAvg": "\u2212\u20ac13M", "trend": "+46.7%", "yoy": "+46.7%" },
              { "season": "2012\u201313", "revenue": "\u20ac245M", "expenses": "\u20ac260M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.1%", "revenueGrowth": "+2.1%",  "rollingAvg": "\u2212\u20ac12M", "trend": "0%",     "yoy": "0%" },
              { "season": "2011\u201312", "revenue": "\u20ac240M", "expenses": "\u20ac255M", "profit": -15, "profitDisplay": "\u2212\u20ac15M", "profitMargin": "\u22126.3%", "revenueGrowth": "\u22122.0%", "rollingAvg": "\u2212\u20ac5M",  "trend": "\u2212200%",  "yoy": "\u2212200%" },
              { "season": "2010\u201311", "revenue": "\u20ac245M", "expenses": "\u20ac250M", "profit": -5,  "profitDisplay": "\u2212\u20ac5M",  "profitMargin": "\u22122.0%", "revenueGrowth": "+1.2%",  "rollingAvg": "+\u20ac5M",   "trend": "\u2212225%",  "yoy": "\u2212225%" }
            ]
          },
          {
            "title": "2000s",
            "total": "+\u20ac139M",
            "seasons": [
              { "season": "2009\u201310", "revenue": "\u20ac242M", "expenses": "\u20ac238M", "profit": 4,  "profitDisplay": "+\u20ac4M",  "profitMargin": "1.7%",  "revenueGrowth": "\u22125.1%", "rollingAvg": "+\u20ac13M", "trend": "\u221273.3%","yoy": "\u221273.3%" },
              { "season": "2008\u201309", "revenue": "\u20ac255M", "expenses": "\u20ac240M", "profit": 15, "profitDisplay": "+\u20ac15M", "profitMargin": "5.9%",  "revenueGrowth": "\u22122.7%", "rollingAvg": "+\u20ac17M", "trend": "\u221221.1%","yoy": "\u221221.1%" },
              { "season": "2007\u201308", "revenue": "\u20ac262M", "expenses": "\u20ac243M", "profit": 19, "profitDisplay": "+\u20ac19M", "profitMargin": "7.3%",  "revenueGrowth": "+6.9%",  "rollingAvg": "+\u20ac19M", "trend": "+11.8%", "yoy": "+11.8%" },
              { "season": "2006\u201307", "revenue": "\u20ac245M", "expenses": "\u20ac228M", "profit": 17, "profitDisplay": "+\u20ac17M", "profitMargin": "6.9%",  "revenueGrowth": "+6.5%",  "rollingAvg": "+\u20ac18M", "trend": "\u221215%", "yoy": "\u221215%" },
              { "season": "2005\u201306", "revenue": "\u20ac230M", "expenses": "\u20ac210M", "profit": 20, "profitDisplay": "+\u20ac20M", "profitMargin": "8.7%",  "revenueGrowth": "+7.0%",  "rollingAvg": "+\u20ac18M", "trend": "+11.1%", "yoy": "+11.1%" },
              { "season": "2004\u201305", "revenue": "\u20ac215M", "expenses": "\u20ac197M", "profit": 18, "profitDisplay": "+\u20ac18M", "profitMargin": "8.4%",  "revenueGrowth": "+10.3%", "rollingAvg": "+\u20ac16M", "trend": "+5.9%",  "yoy": "+5.9%" },
              { "season": "2003\u201304", "revenue": "\u20ac195M", "expenses": "\u20ac178M", "profit": 17, "profitDisplay": "+\u20ac17M", "profitMargin": "8.7%",  "revenueGrowth": "+16.1%", "rollingAvg": "+\u20ac13M", "trend": "+30.8%", "yoy": "+30.8%" },
              { "season": "2002\u201303", "revenue": "\u20ac168M", "expenses": "\u20ac155M", "profit": 13, "profitDisplay": "+\u20ac13M", "profitMargin": "7.7%",  "revenueGrowth": "+15.9%", "rollingAvg": "+\u20ac10M", "trend": "+62.5%", "yoy": "+62.5%" },
              { "season": "2001\u201302", "revenue": "\u20ac145M", "expenses": "\u20ac137M", "profit": 8,  "profitDisplay": "+\u20ac8M",  "profitMargin": "5.5%",  "revenueGrowth": "+9.0%",  "rollingAvg": "+\u20ac8M",  "trend": "0%",     "yoy": "0%" },
              { "season": "2000\u201301", "revenue": "\u20ac133M", "expenses": "\u20ac125M", "profit": 8,  "profitDisplay": "+\u20ac8M",  "profitMargin": "6.0%",  "revenueGrowth": "\u2014",     "rollingAvg": "+\u20ac8M",  "trend": "\u2014",      "yoy": "\u2014" }
            ]
          }
        ]
      }
    },
  
    "stadium": {
      "name": "San Siro / Stadio Giuseppe Meazza",
      "openedDate": "1926-09-19",
      "opened": "19 September 1926",
      "capacity": "75,817",
      "location": "Milan, Italy",
      "renovation": "1935, 1955, 1990, 2015\u20132016",
      "uefaCategory": "Category 4",
      "nickname": "La Scala del Calcio",
      "tenants": "AC Milan, Inter Milan",
      "intro": "AC Milan play their home matches at the San Siro, officially known as the Stadio Giuseppe Meazza. Shared with city rivals Inter, it is one of the largest and most iconic football stadiums in Europe, affectionately nicknamed 'La Scala del Calcio' (The Scala of Football) after Milan's famous opera house.",
      "trainingGround": {
        "facility": "Milanello Sports Centre",
        "location": "Carnago, Varese",
        "openedYear": 1963,
        "size": "1.6 km\u00b2"
      }
    },
  
    "staff": {
      "intro": "AC Milan's current and historical staff \u2014 from the head coach and their assistants, to the club's leadership and past presidents. Hover over any period to see the exact start and end dates, or hover over a flag to see the person's nationality.",
      "current": {
        "summary": {
          "headCoach": "Paulo Fonseca",
          "headCoachDesc": "Since July 2024",
          "coachingStaff": "5 members",
          "coachingStaffDesc": "Assistants, GK, fitness",
          "president": "Paolo Scaroni",
          "presidentDesc": "Since July 2018",
          "boardMembers": "5 listed",
          "boardMembersDesc": "CEO and board"
        },
        "coaching": [
          { "name": "Paulo Fonseca",          "flag": "portugal", "country": "Portugal", "role": "Head Coach",        "since": "July 2024",  "sinceDate": "1 July 2024",  "current": true },
          { "name": "S\u00e9rgio Ferreira",     "flag": "portugal", "country": "Portugal", "role": "Assistant Coach",   "since": "July 2024",  "sinceDate": "1 July 2024" },
          { "name": "Paulo Ferreira",          "flag": "portugal", "country": "Portugal", "role": "Assistant Coach",   "since": "July 2024",  "sinceDate": "1 July 2024" },
          { "name": "Diamantino Figueiredo",   "flag": "portugal", "country": "Portugal", "role": "Goalkeeping Coach", "since": "July 2024",  "sinceDate": "1 July 2024" },
          { "name": "Roberto Perrone",         "flag": "italy",    "country": "Italy",    "role": "Fitness Coach",     "since": "July 2024",  "sinceDate": "1 July 2024" },
          { "name": "Geoffrey Moncada",        "flag": "france",   "country": "France",   "role": "Technical Director","since": "July 2019",  "sinceDate": "1 July 2019" }
        ],
        "leadership": [
          { "name": "Paolo Scaroni",           "flag": "italy",    "country": "Italy",    "role": "President",           "since": "July 2018",   "sinceDate": "1 July 2018",   "current": true },
          { "name": "Giorgio Furlani",         "flag": "italy",    "country": "Italy",    "role": "Chief Executive",     "since": "January 2023","sinceDate": "1 January 2023" },
          { "name": "Franco Baresi",           "flag": "italy",    "country": "Italy",    "role": "Honorary Vice President","since": "November 2008","sinceDate": "1 November 2008" },
          { "name": "Zlatan Ibrahimovi\u0107",   "flag": "sweden",   "country": "Sweden",   "role": "Senior Advisor",      "since": "December 2023","sinceDate": "1 December 2023" },
          { "name": "Gerry Cardinale",         "flag": "usa",      "country": "USA",      "role": "Founder, RedBird",    "since": "August 2022", "sinceDate": "1 August 2022" }
        ]
      },
      "managers": {
        "summary": {
          "total": "45",
          "mostDecorated": "Fabio Capello",
          "mostDecoratedDesc": "9 trophies",
          "longestTenure": "Carlo Ancelotti",
          "longestTenureDesc": "8 years \u00b7 2001\u20132009",
          "current": "Paulo Fonseca",
          "currentDesc": "Since July 2024"
        },
        "list": [
          { "name": "Paulo Fonseca",         "flag": "portugal",    "country": "Portugal",    "period": "2024\u2013present", "note": "Current",                    "trophies": 0, "current": true },
          { "name": "Stefano Pioli",         "flag": "italy",       "country": "Italy",       "period": "2019\u20132024",    "note": "Scudetto 2022",              "trophies": 1 },
          { "name": "Gennaro Gattuso",       "flag": "italy",       "country": "Italy",       "period": "2017\u20132019",    "note": "Club legend as player",      "trophies": 0 },
          { "name": "Vincenzo Montella",     "flag": "italy",       "country": "Italy",       "period": "2016\u20132017",    "note": "Supercoppa 2016",            "trophies": 1 },
          { "name": "Sini\u0161a Mihajlovi\u0107",   "flag": "serbia",      "country": "Serbia",      "period": "2015\u20132016",    "note": "Ten months",                 "trophies": 0 },
          { "name": "Filippo Inzaghi",       "flag": "italy",       "country": "Italy",       "period": "2014\u20132015",    "note": "Promoted from youth team",   "trophies": 0 },
          { "name": "Clarence Seedorf",      "flag": "netherlands", "country": "Netherlands", "period": "2014",         "note": "Four months",                "trophies": 0 },
          { "name": "Massimiliano Allegri",  "flag": "italy",       "country": "Italy",       "period": "2010\u20132014",    "note": "Scudetto 2011",              "trophies": 2 },
          { "name": "Leonardo",              "flag": "brazil",      "country": "Brazil",      "period": "2009\u20132010",    "note": "One season",                 "trophies": 0 },
          { "name": "Carlo Ancelotti",       "flag": "italy",       "country": "Italy",       "period": "2001\u20132009",    "note": "2 UCL \u00b7 Longest-serving",   "trophies": 8 },
          { "name": "Fatih Terim",           "flag": "turkey",      "country": "Turkey",      "period": "2001",         "note": "Five months",                "trophies": 0 },
          { "name": "Cesare Maldini",        "flag": "italy",       "country": "Italy",       "period": "2000\u20132001",    "note": "Interim",                    "trophies": 0 },
          { "name": "Alberto Zaccheroni",    "flag": "italy",       "country": "Italy",       "period": "1998\u20132001",    "note": "Scudetto 1999",              "trophies": 1 },
          { "name": "Fabio Capello",         "flag": "italy",       "country": "Italy",       "period": "1991\u20131996",    "note": "4 Scudetti \u00b7 Most decorated", "trophies": 9 },
          { "name": "Arrigo Sacchi",         "flag": "italy",       "country": "Italy",       "period": "1987\u20131991",    "note": "2 European Cups",            "trophies": 7 },
          { "name": "Nils Liedholm",         "flag": "sweden",      "country": "Sweden",      "period": "1979\u20131984",    "note": "Also player 1949\u20131961",    "trophies": 2 },
          { "name": "Giovanni Trapattoni",   "flag": "italy",       "country": "Italy",       "period": "1974\u20131976",    "note": "Coppa Italia 1977",          "trophies": 1 },
          { "name": "Nereo Rocco",           "flag": "italy",       "country": "Italy",       "period": "1961\u20131972",    "note": "2 UCL \u00b7 Multiple spells",   "trophies": 6 }
        ]
      },
      "presidents": {
        "summary": {
          "total": "22",
          "longest": "Silvio Berlusconi",
          "longestDesc": "31 years \u00b7 1986\u20132017",
          "current": "Paolo Scaroni",
          "currentDesc": "Since July 2018",
          "mostTrophies": "Silvio Berlusconi",
          "mostTrophiesDesc": "29 major trophies"
        },
        "list": [
          { "name": "Paolo Scaroni",         "flag": "italy",    "country": "Italy",    "period": "2018\u2013present", "periodDate": "21 July 2018 \u2013 Present",           "achievements": "Scudetto 2022, return to European elite", "current": true },
          { "name": "Li Yonghong",           "flag": "china",    "country": "China",    "period": "2017\u20132018",    "periodDate": "14 April 2017 \u2013 21 July 2018",      "achievements": "Chinese ownership; brief and turbulent" },
          { "name": "Marco Fassone",         "flag": "italy",    "country": "Italy",    "period": "2017",         "periodDate": "21 March 2017 \u2013 14 April 2017",     "achievements": "Interim" },
          { "name": "Silvio Berlusconi",     "flag": "italy",    "country": "Italy",    "period": "1986\u20132017",    "periodDate": "20 February 1986 \u2013 13 April 2017",   "achievements": "5 European Cups, 8 Serie A titles, transformed AC Milan into a global powerhouse" },
          { "name": "Giuseppe Farina",       "flag": "italy",    "country": "Italy",    "period": "1982\u20131986",    "periodDate": "1 January 1982 \u2013 20 February 1986",  "achievements": "One Serie A title" },
          { "name": "Gaetano Morazzoni",     "flag": "italy",    "country": "Italy",    "period": "1980\u20131982",    "periodDate": "1 January 1980 \u2013 1 January 1982",    "achievements": "Relegation and immediate promotion" },
          { "name": "Felice Colombo",        "flag": "italy",    "country": "Italy",    "period": "1977\u20131980",    "periodDate": "1 January 1977 \u2013 1 January 1980",    "achievements": "Serie A title 1979" },
          { "name": "Albino Buticchi",       "flag": "italy",    "country": "Italy",    "period": "1975\u20131977",    "periodDate": "1 January 1975 \u2013 1 January 1977",    "achievements": "Coppa Italia 1977" },
          { "name": "Andrea Rizzoli",        "flag": "italy",    "country": "Italy",    "period": "1954\u20131963",    "periodDate": "1 January 1954 \u2013 1 January 1963",    "achievements": "First European Cup, 4 Serie A titles" },
          { "name": "Umberto Trabattoni",    "flag": "italy",    "country": "Italy",    "period": "1945\u20131954",    "periodDate": "1 January 1945 \u2013 1 January 1954",    "achievements": "2 Serie A titles, post-war rebuilding" }
        ]
      }
    },
  
    "records": [
      { "label": "Most appearances (all competitions)", "value": "Paolo Maldini \u2014 902" },
      { "label": "Most goals (all competitions)", "value": "Gunnar Nordahl \u2014 221" },
      { "label": "Most goals in a single season", "value": "Gunnar Nordahl \u2014 38 (1949\u201350)" },
      { "label": "Most trophies won (player)", "value": "Paolo Maldini \u2014 26" },
      { "label": "Most Champions League titles (player)", "value": "Paolo Maldini, Alessandro Costacurta \u2014 5" },
      { "label": "Most European Cup titles (club)", "value": "7" },
      { "label": "Most Serie A titles (club)", "value": "19" },
      { "label": "Biggest win (Serie A)", "value": "AC Milan 9\u20130 Palermo (1950\u201351)" },
      { "label": "Biggest win (European competition)", "value": "AC Milan 8\u20130 Union Luxembourg (1962\u201363)" },
      { "label": "Longest unbeaten run (Serie A)", "value": "58 matches (1991\u20131993, world record at the time)" },
      { "label": "Consecutive European Cup wins", "value": "2 (1989, 1990)" },
      { "label": "Most expensive signing", "value": "Rafael Le\u00e3o \u2014 \u20ac23M (2019, from Lille)" }
    ],
  
    "players": [
      { "slug": "paolo-maldini",        "name": "Paolo Maldini",       "yearsData": [1984, 2009], "years": "1984\u20132009", "flag": "italy",      "country": "Italy" },
      { "slug": "franco-baresi",        "name": "Franco Baresi",       "yearsData": [1977, 1997], "years": "1977\u20131997", "flag": "italy",      "country": "Italy" },
      { "slug": "marco-van-basten",     "name": "Marco van Basten",    "yearsData": [1987, 1995], "years": "1987\u20131995", "flag": "netherlands","country": "Netherlands" },
      { "slug": "ruud-gullit",          "name": "Ruud Gullit",         "yearsData": [1987, 1993], "years": "1987\u20131993", "flag": "netherlands","country": "Netherlands" },
      { "slug": "frank-rijkaard",       "name": "Frank Rijkaard",      "yearsData": [1988, 1993], "years": "1988\u20131993", "flag": "netherlands","country": "Netherlands" },
      { "slug": "andriy-shevchenko",    "name": "Andriy Shevchenko",   "yearsData": [1999, 2006], "years": "1999\u20132006", "flag": "ukraine",    "country": "Ukraine" },
      { "slug": "kaka",                 "name": "Kak\u00e1",            "yearsData": [2003, 2009], "years": "2003\u20132009", "flag": "brazil",     "country": "Brazil" },
      { "slug": "alessandro-nesta",     "name": "Alessandro Nesta",    "yearsData": [2002, 2012], "years": "2002\u20132012", "flag": "italy",      "country": "Italy" },
      { "slug": "andrea-pirlo",         "name": "Andrea Pirlo",        "yearsData": [2001, 2011], "years": "2001\u20132011", "flag": "italy",      "country": "Italy" },
      { "slug": "gennaro-gattuso",      "name": "Gennaro Gattuso",     "yearsData": [1999, 2012], "years": "1999\u20132012", "flag": "italy",      "country": "Italy" },
      { "slug": "zlatan-ibrahimovic",   "name": "Zlatan Ibrahimovi\u0107","yearsData": [2010, 2023], "years": "2010\u20132023", "flag": "sweden",     "country": "Sweden" }
    ],
  
    "transfers": {
      "summary": {
        "totalIn": "\u20ac75M",
        "totalOut": "\u20ac45M",
        "netSpend": "\u2212\u20ac30M",
        "latestPlayer": "Youssouf Fofana",
        "latestDesc": "\u20ac25M \u00b7 from Monaco \u00b7 2024"
      },
      "latest": [
        {
          "player": "Youssouf Fofana",
          "playerSlug": "youssouf-fofana",
          "flag": "france",
          "country": "France",
          "position": "Midfielder",
          "direction": "in",
          "from": "AS Monaco",
          "fromSlug": "monaco",
          "to": "AC Milan",
          "toSlug": "ac-milan",
          "fee": "\u20ac25M",
          "feeValue": 25000000,
          "date": "2024-08-16",
          "type": "Permanent"
        },
        {
          "player": "Strahinja Pavlovi\u0107",
          "playerSlug": "strahinja-pavlovic",
          "flag": "serbia",
          "country": "Serbia",
          "position": "Defender",
          "direction": "in",
          "from": "RB Salzburg",
          "fromSlug": "rb-salzburg",
          "to": "AC Milan",
          "toSlug": "ac-milan",
          "fee": "\u20ac18M",
          "feeValue": 18000000,
          "date": "2024-07-01",
          "type": "Permanent"
        },
        {
          "player": "Charles De Ketelaere",
          "playerSlug": "charles-de-ketelaere",
          "flag": "belgium",
          "country": "Belgium",
          "position": "Attacking Midfielder",
          "direction": "out",
          "from": "AC Milan",
          "fromSlug": "ac-milan",
          "to": "Atalanta",
          "toSlug": "atalanta",
          "fee": "\u20ac22M",
          "feeValue": 22000000,
          "date": "2024-07-15",
          "type": "Permanent"
        }
      ]
    },
  
    "info": {
      "intro": "Key facts about AC Milan."
    },
  
    "ownership": {
      "title": "Private Equity Ownership",
      "paragraphs": [
        "AC Milan is owned by <strong>RedBird Capital Partners</strong>, an American private investment firm founded by Gerry Cardinale, which acquired the club in <strong>August 2022</strong> for approximately <strong>\u20ac1.2 billion</strong>.",
        "The club spent <strong>31 years under Silvio Berlusconi</strong> (1986\u20132017), the longest and most successful ownership in its history. A brief Chinese-led era (2017\u20132018) was followed by <strong>Elliott Management</strong>'s stewardship (2018\u20132022) before RedBird took over. Unlike Real Madrid, Milan does not operate as a member-owned club; strategic decisions are made by the ownership group and its appointed board."
      ]
    }
  };