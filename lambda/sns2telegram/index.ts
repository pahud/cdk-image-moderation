import axios from 'axios';

export async function handler(event: any) {
  console.log('Event: %j', event)
  if (event.Records && event.Records.length > 0 ) {
    const record = event.Records[0]
    const message = record['Sns']['Message']
    const subject = record['Sns']['Subject']
    console.log(`subject: ${subject} message: ${message}`)
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    await sendMessage(token, chatId, message )
  }
  return "OK"
}

async function sendMessage(token: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const apiClient = axios.create({
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await apiClient.post(url, {
    chat_id: chatId,
    text: text,
  })
  console.log(result)
}
