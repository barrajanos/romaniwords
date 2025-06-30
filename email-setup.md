# 📧 Email Newsletter Setup Útmutató

## 1. EmailJS Regisztráció és Setup

### 1.1 EmailJS fiók létrehozása
1. Menj a [https://www.emailjs.com/](https://www.emailjs.com/) oldalra
2. Regisztrálj egy új fiókot
3. Erősítsd meg az email címedet

### 1.2 Email Service hozzáadása
1. Lépj be az EmailJS dashboardra
2. Kattints az "Email Services" menüre
3. Válaszd ki a Gmail-t (vagy más email szolgáltatót)
4. Kövesd az utasításokat a hitelesítéshez
5. Jegyezd fel a **Service ID**-t

### 1.3 Email Template létrehozása
1. Kattints az "Email Templates" menüre
2. Kattints a "Create New Template" gombra
3. Másold be az alábbi template-et:

**Template neve:** `daily_romani_word`

**Subject:** `🎯 {{date}} | Napi Romani Szó`

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border: 3px solid #000;
            padding: 30px;
            margin: 20px 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .word-illustration {
            font-size: 3em;
            text-align: center;
            margin: 20px 0;
        }
        .word-romani {
            font-size: 2.2em;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }
        .word-pronunciation {
            font-size: 1.2em;
            color: #666;
            text-align: center;
            font-style: italic;
            margin-bottom: 15px;
        }
        .word-hungarian {
            font-size: 1.6em;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
            color: #007bff;
        }
        .word-definition {
            font-size: 1.1em;
            text-align: center;
            margin-bottom: 25px;
            padding: 15px;
            background: #f5f5f5;
            border-left: 4px solid #000;
        }
        .examples {
            margin: 25px 0;
            padding: 20px;
            background: #f9f9f9;
            border: 2px solid #000;
        }
        .example-label {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .example-romani {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .example-hungarian {
            color: #666;
            font-style: italic;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #000;
            color: #666;
        }
        .website-btn {
            display: inline-block;
            padding: 12px 25px;
            background: #000;
            color: white;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
            border: 2px solid #000;
        }
        .website-btn:hover {
            background: white;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Napi Romani Szó</h1>
            <p><strong>{{date}}</strong></p>
        </div>
        
        <div class="word-illustration">{{illustration}}</div>
        <div class="word-romani">{{romani}}</div>
        <div class="word-pronunciation">[{{pronunciation}}]</div>
        <div class="word-hungarian">{{hungarian}}</div>
        <div class="word-definition">{{definition}}</div>
        
        <div class="examples">
            <div class="example-label">📝 Példa:</div>
            <div class="example-romani">{{exampleRomani}}</div>
            <div class="example-hungarian">→ {{exampleHungarian}}</div>
        </div>
        
        <div class="footer">
            <a href="{{website_url}}" class="website-btn">🌐 Látogasd meg a weboldalt</a>
            <p>📚 Minden nap egy új romani szó!</p>
            <p><small>Ha nem szeretnéd megkapni ezeket az emaileket, <a href="mailto:your-email@domain.com?subject=Leiratkozas">ide kattintva</a> leiratkozhatsz.</small></p>
        </div>
    </div>
</body>
</html>
```

4. Mentsd el a template-et
5. Jegyezd fel a **Template ID**-t

### 1.4 API kulcsok megszerzése
1. Menj a "Account" > "General" menübe
2. Másold ki a **Public Key**-t
3. Generálj egy **Private Key**-t és másold ki

## 2. GitHub Secrets beállítása

A GitHub repository-ban menj a Settings > Secrets and variables > Actions menübe és add hozzá:

- `EMAILJS_SERVICE_ID`: Az EmailJS service ID
- `EMAILJS_TEMPLATE_ID`: Az EmailJS template ID  
- `EMAILJS_PUBLIC_KEY`: Az EmailJS public key
- `EMAILJS_PRIVATE_KEY`: Az EmailJS private key
- `SUBSCRIBERS_LIST`: JSON formátumban a feliratkozók listája, pl: `["email1@example.com", "email2@example.com"]`

## 3. Használat

### Frontend feliratkozás
- A felhasználók a "📧 Feliratkozom" gombbal tudnak feliratkozni
- Az email címek egyelőre localStorage-ban tárolódnak
- A valós implementációban az emailek egy adatbázisba vagy GitHub Secrets-be kerülnek

### Napi email küldés
- A GitHub Actions workflow minden nap 8:00 UTC-kor (9:00/10:00 magyar idő) fut le
- Automatikusan elküldi a napi szót minden feliratkozónak
- Manuálisan is elindítható a GitHub Actions oldalon

### Email sablon tartalma
Az email ugyanazokat az adatokat tartalmazza, mint egy szó adatlap:
- 📅 Dátum
- 🎨 Ikon/illusztráció  
- 🗣️ Romani szó
- 📖 Kiejtés
- 🇭🇺 Magyar fordítás
- 💡 Definíció
- 📝 Példa mondatok (romani és magyar)
- 🔗 Link a weboldalra

## 4. Tesztelés

A workflow manuálisan is elindítható:
1. Menj a GitHub repository Actions tab-jára
2. Válaszd ki a "Daily Romani Word Newsletter" workflow-t
3. Kattints a "Run workflow" gombra

## 5. Monitoring

A GitHub Actions logokban láthatod:
- Hány feliratkozónak küldött emailt
- Melyik szót küldte el
- Esetleges hibákat

---

✨ **Tipp:** Kezdetben teszteld kis feliratkozói listával, és fokozatosan bővítsd! 