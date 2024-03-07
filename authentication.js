const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();

const secret = speakeasy.generateSecret();

app.get("/generate_QR",(req,resp)=>{
    qrcode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
     resp.send('QR code URL:', imageUrl);
      // you can then display the QR by adding'<img src="' + imageUrl + '">';
    });
})
