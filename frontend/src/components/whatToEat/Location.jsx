import React, { useState } from "react";
import { useWhatToEat } from "../../contexts/whatToEat";
import "./WhatToEat.scss";

const Location = ({ wreset, windex, wquestion, woptions, wanswer, wincrement, wadd, wedit }) => {
  // const [lon, setLon] = useState();
  // const [lat, setLat] = useState();
  const [locate, setLocate] = useState("");

  const answering = (locate) => {
    wanswer.length === windex ? wadd(locate) : wedit(locate); // 첫 응답 : 응답 수정
    wincrement();
    // //console.log(wanswer);
  };

  function getLocation() {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // alert(position.coords.latitude + " " + position.coords.longitude);
          // setLat(position.coords.latitude);
          // setLon(position.coords.longitude);

          // 좌표추출
          var geocoder = new window.daum.maps.services.Geocoder();
          var callback = function (result, status) {
            if (status === window.daum.maps.services.Status.OK) {
              setLocate(result[0].region_2depth_name + " " + result[0].region_3depth_name); // 좌표를 지역이름으로 변경
              //console.log(result);
            }
          };
          geocoder.coord2RegionCode(position.coords.longitude, position.coords.latitude, callback); // 현재위치 좌표 가져오기
        },
        function (error) {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("위치 정보 제공을 허용해주세요!");
    }
  }

  return (
    <div>
      <button className="currLocBtn" onClick={getLocation}>
        현위치
      </button>
      {locate !== "" && (
        <>
          <span className="loc">:&nbsp;{locate}&nbsp;&nbsp;</span>
          <button
            className="locBtn"
            onClick={function () {
              // 응답 진행중
              answering(locate);
            }}
          >
            선택
          </button>
        </>
      )}
      {/* {//console.log(lon + " / " + lat)} */}
    </div>
  );
};

export default useWhatToEat(({ state, actions }) => ({
  wreset: actions.wreset,
  windex: state.windex,
  wquestion: state.wquestion,
  woptions: state.woptions,
  wanswer: state.wanswer,
  wadd: actions.wadd,
  wedit: actions.wedit,
  wincrement: actions.wincrement,
}))(Location);
