import React, { useState } from "react";
import styles from "../styles/ModalPartners.module.css";
import PartnersApi from "../pages/mockDatas/partnersapi/static.json";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import PhoneInput from "react-phone-input-2";

export default function ModalPartners({ setOpenPartnersModal }) {

  const [name, setName] = useState("");
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState("");
  const [btnStyle, setBtnStyle] = useState(null);
  const [isSend, setIsSend] = useState(false);
  const [hCaptchaResponse, setHCaptchaResponse] = useState('');

  const { locale } = useRouter();

  const buttonStyle = () => {
    if (name !== '' && comment !== '') {
      setBtnStyle(true);
    } else {
      setBtnStyle(false);
    }
  };

  // ✅ Env’dan token va chat_id olish
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chat_id = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  const handleHCaptchaVerify = (responseToken) => {
    setHCaptchaResponse(responseToken);
  };

  const isHCaptchaChecked = () => {
    return hCaptchaResponse !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && number !== '' && comment !== "" && isHCaptchaChecked()) {

      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chat_id,
          parse_mode: 'html',
          text:
            "Ism: " + name +
            "\nTelefon raqam: +" + number +
            "\nIzoh: " + comment,
        }),
      })
        .then((response) => console.log(response))
        .catch(err => console.log(err));

      setName("");
      setComment("");
      setNumber("");
      setBtnStyle(false);
      setIsSend(true);
      setTimeout(() => {
        setOpenPartnersModal(false);
      }, 4000);
    }

  };

  return (
    PartnersApi.partners
      .filter((p) => p.languages_code === locale)
      .map(value =>
        <div key={value.id}>
          <div className={styles.modal_bg}>
            <div onClick={(e) => e.stopPropagation()} className={styles.modal_content}>

              <div className={styles.modal_close}>
                <h3>{value.title}</h3>
                <div onClick={() => setOpenPartnersModal(false)}>
                  <img src="/modal-times.svg" />
                </div>
              </div>

              {
                isSend ? <span className={styles.thanksMessage}>{value.thanks}</span> :
                  <form onSubmit={handleSubmit} className={styles.body}>
                    <label htmlFor="name">{value.label_name}</label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      id="name"
                      placeholder={value.placeholder_name}
                    />

                    <label htmlFor="number">{value.label_phone}</label>
                    <PhoneInput
                      id="number"
                      specialLabel=""
                      country={'uz'}
                      countryCodeEditable={false}
                      value={number}
                      required
                      onChange={(number) => {
                        setNumber(number);
                        buttonStyle();
                      }}
                      onKeyUp={buttonStyle}
                      enableAreaCodes={true}
                      placeholder="+998"
                      className={styles.input}
                    />

                    <label>{value.label_comment}</label>
                    <textarea
                      onKeyUp={buttonStyle}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      cols="50"
                      placeholder={value.placeholder_comment}
                      required
                    ></textarea>

                    <div className={styles.captcha}>
                      <HCaptcha
                        sitekey="9a098deb-3095-4202-97c0-347d8a1b43e2"
                        onVerify={handleHCaptchaVerify}
                      />
                      {isHCaptchaChecked() ? null : <p>Captcha tekshirilmadi!</p>}
                    </div>

                    <button
                      className={btnStyle ? styles.activeBtn : ''}
                      type="submit"
                    >
                      {value.button}
                    </button>
                  </form>
              }
            </div>
          </div>
        </div>
      )
  );
}
