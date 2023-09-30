import express from "express";
import cors from "cors"
import "dotenv/config"
import { Configuration, OpenAIApi } from "openai";

const app = express()


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

console.log(process.env.OPENAI_API_KEY)

app.use(cors())
app.use(express.json())

const systemPromt = `Sen verilen isim için kahve falı yorumu üretecek bir araçsın. Kullanıcıdan aldığın ad ve soyad, ne ile ilgili yorum yapacağını ve kaç adet yorum üretileceğini kullanarak aşağıdaki şablon formatında yorumlar üreteceksin.

name:Ad soyad
comment:Kahve Falı Yorumu


Eğer kahve falı hakkında yorum yapacak bir fikrin yok ise "NO_COMMENT" döndür. Yorumlarına kahve fincanında gördüğüm işaretler diyerek başla ve Kahve falı dışındaki tüm sorulara yanıt verme ve verdiğin cevaplar yukarıdaki formata uygun şekilde konu ile gerçekten alakalı bilgiler olmalı.`

app.get('/', (req, res) => {   
    res.send('Hello Worlds')
})

app.post('/kahve-fali', async (req, res) => { 
   
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:  [
            {
                role: "system",
                content: systemPromt
            },
            {
                role: "user", 
                content: `${req.body.falSahibi} - ${req.body.commentType} - 1 adet`
            }
        ],
    })


    if (completion.data.choices[0].message.content === "NO_COMMENT") {
		return res.send({
			error: true
		})
	}


    const str = completion.data.choices[0].message.content;
    const regex = /name:\s*(.*?)\s*comment:\s*(.*)/s;
    const matches = [];
    let match;


    if (match = regex.exec(str)) {
        matches.push({ name: match[1], comment: match[2] });
    }else {
        console.log("NO MATCH")
    }
    


    console.log(matches);
	res.send(matches)
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})