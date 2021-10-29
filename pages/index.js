import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getSorterIEO } from "../lib/ieo";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export async function getStaticProps() {
  const orderItems = getSorterIEO();
  return { props: { orderItems } };
}

export default function Home({ orderItems }) {
  const [disableButton, setDisableButton] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [partyTime, setPartyTime] = useState(false);
  const [ieoFull, setIEOFull] = useState(false);
  const [boo, setBoo] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (partyTime) return () => {};

    const target = new Date("10/29/2021 19:59:59");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);

      if (h <= 0 && m <= 0 && s <= 0) {
        setPartyTime(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`/api/order-items/`).then(async (res) => {
      const { status } = res;

      if (status !== 200) {
        return () => {};
      }

      const orderItems = await res.json();

      if (!ieoFull && orderItems.length >= 10) {
        // setBoo(true);
        setIEOFull(true);
      }

      setOrderList(orderItems);
    });
    return () => {};
  }, []);

  const ieoCode = Cookies.get("ieoCode") || undefined;

  const orderIEO = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const code = String(Math.floor(Math.random() * 10000)).padStart(4, 0);
    const res = await fetch(`/api/ieo-order/`, {
      body: JSON.stringify({ name, code }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const { status } = res;

    if (status !== 200) {
      return false;
    }

    const _res = await res.json();
    if (!boo && _res.length >= 10) {
      setBoo(true);
      setIEOFull(true);
    }

    Cookies.remove("ieoCode");

    document.cookie = Cookies.set("ieoCode", code, {
      expires: 7,
      httpOnly: false,
      secure: false,
      path: "/",
    });

    setOrderList(_res);
    return true;
  };

  return (
    <div className={(styles.container, boo ? "boo" : undefined)}>
      <Head>
        <title>Happy Halloween (TabSolution)</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className={"mid-center"}>
        {process.env.HOST}asd
        {ieoFull ? (
          <>
            <div>
              <h3>TabCoin IEO Захиалга дүүрсэн байна.</h3>
              <h4>Happy Halloween 2021 оролцсонд баярлалаа.</h4>
            </div>
          </>
        ) : (
          <>
            <form
              name="ieo"
              onSubmit={orderIEO}
              action="/ieo"
              className={"ieo_form"}
            >
              <input
                name="name"
                required={true}
                placeholder={"Нэрээ оруулна уу."}
                className={"ieo_name_input"}
              ></input>
              <button
                className={"btn-ieo"}
                type="submit"
                onSubmit={() => setDisableButton(true)}
                disabled={disableButton}
              >
                Dar.
              </button>
            </form>
          </>
        )}
        {orderList.map(({ code, name, date }, idx) => {
          return (
            <div key={code}>
              <ul>
                <li
                  className={
                    String(ieoCode) === String(code) ? "chosen" : undefined
                  }
                >
                  {idx + 1}. {code} {name} -{" "}
                  {dayjs(date).format("MM.DD HH:mm:ss")} = {ieoCode}
                </li>
              </ul>
            </div>
          );
        })}
      </div> */}

      {partyTime ? (
        <>
          <div className={"mid-center"}>
            {ieoFull ? (
              <>
                <div>
                  <h3>TabCoin IEO Захиалга дүүрсэн байна.</h3>
                  <h4>Happy Halloween 2021 оролцсонд баярлалаа.</h4>
                </div>
              </>
            ) : (
              <>
                <form
                  name="ieo"
                  onSubmit={orderIEO}
                  action="/ieo"
                  className={"ieo_form"}
                >
                  <input
                    name="name"
                    required={true}
                    placeholder={"Нэрээ оруулна уу."}
                    className={"ieo_name_input"}
                  ></input>
                  <button
                    className={"btn-ieo"}
                    type="submit"
                    onSubmit={() => setDisableButton(true)}
                    disabled={disableButton}
                  >
                    Dar.
                  </button>
                </form>

                {orderList.map(({ code, name, date }, idx) => {
                  return (
                    <div key={code}>
                      <ul>
                        <li
                          className={
                            String(ieoCode) === String(code)
                              ? "chosen"
                              : undefined
                          }
                        >
                          {idx + 1}. {name} -{" "}
                          {dayjs(date).format("MM.DD HH:mm:ss")}
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={"mid-center"}>
              <h3>TabCoin IEO Захиалга эхлэхэд.</h3>
              <h1>
                {String(hours).padStart(2, 0)}:{String(minutes).padStart(2, 0)}:
                {String(seconds).padStart(2, 0)}
              </h1>
              <h3>үлдсэн байна.</h3>
              <h4>Happy Halloween 2021.</h4>
          </div>
        </>
      )}
    </div>
  );
}
