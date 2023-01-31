const catchAsync = require('../utils/catchAsync');
const { default: fetch } = require('node-fetch');

exports.generateDescription = catchAsync(async (req, res, next) => {
  const { fewLines } = req.body;

  console.log('REACHED generateDescription with fewLInes=>', fewLines);

  const prompt = `Generate a 300 words description about my property for selling on an online platform. Make it look professional as it will describe about my property. Some informations are: ${fewLines}`;

  const resp = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 400,
      stream: false,
      n: 1,
    }),
  });

  const data = await resp.json();
  console.log('DATA FROM generateDEscription as response=>', data);

  res.status(200).json({ sattus: 'WORKING AI', data });
});
