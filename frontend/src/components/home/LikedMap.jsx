import React from "react";
import "./LikedMap.scss";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Loading from "../map/Loading";
import CarouselSlider from "../common/CarouselSlider";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class LikedMap extends React.Component {
  constructor(props) {
    super(props);

    let pos = window.sessionStorage.getItem("pos");

    var latitude = 37.501503;
    var longitude = 127.039778;

    if (pos) {
      latitude = pos.split(",")[0];
      longitude = pos.split(",")[1];
    }

    // 초기 값을 멀티캠퍼스 역삼으로 설정
    this.state = {
      latitude: latitude,
      longitude: longitude,
      check: false,
      stores: [],
      loading: false,
      infowindow: new window.kakao.maps.InfoWindow({ zIndex: 1 }),
    };
  }

  markers = [];
  map = "";
  user = JSON.parse(window.sessionStorage.getItem("user"));
  pos = window.sessionStorage.getItem("pos");
  componentDidMount() {
    this.makeMap();
  }

  onClickPos = () => {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            check: true,
          });

          // 세션 스토리지에 저장하기
          if (window.sessionStorage.getItem("pos")) window.sessionStorage.removeItem("pos");
          window.sessionStorage.setItem("pos", [position.coords.latitude, position.coords.longitude]);

          // 지도의 시작점 변경
          this.panTo();
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
      this.makeMap();
      alert("GPS를 지원하지 않아 현재위치를 가져올 수 없습니다");
    }
  };

  panTo = () => {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new window.kakao.maps.LatLng(this.state.latitude, this.state.longitude);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    this.map.panTo(moveLatLon);

    // 로그인했을때만 불러오기
    if (this.user) {
      this.removeMarker();
      this.axiosStores();
    }
  };

  // 표시되어 있는 마커 삭제
  removeMarker = () => {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  };

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  addMarker = (position, idx) => {
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new window.kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new window.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new window.kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new window.kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(this.map); // 지도 위에 마커를 표출합니다
    this.markers.push(marker); // 배열에 생성된 마커를 추가합니다

    return marker;
  };

  // 현 정보 기반 새로운 식당 정보 받아오기
  axiosStores = () => {
    //Loading 표시
    this.setState({
      loading: true,
    });

    // 현위치 표시
    var imageSrc = "https://image.flaticon.com/icons/svg/854/854866.svg", // 마커이미지의 주소입니다
      imageSize = new window.daum.maps.Size(44, 49), // 마커이미지의 크기입니다
      imageOption = { offset: new window.daum.maps.Point(27, 45) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new window.daum.maps.MarkerImage(imageSrc, imageSize, imageOption),
      markerPosition = new window.daum.maps.LatLng(this.state.latitude, this.state.longitude); // 마커가 표시될 위치입니다

    var marker = new window.daum.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });
    marker.setMap(this.map);
    this.markers.push(marker);

    // axios 호출
    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/location_based/${this.user.id}/${String(this.state.latitude)}/${String(this.state.longitude)}/2`,
    })
      .then((res) => {
        //console.log(res);

        for (var i = 0; i < res.data.data.length; i++) {
          // 마커를 생성하고 지도에 표시합니다
          var placePosition = new window.kakao.maps.LatLng(res.data.data[i].latitude, res.data.data[i].longitude),
            marker = this.addMarker(placePosition, i);

          // 마커와 검색결과 항목에 mouseover 했을때
          // 해당 장소에 인포윈도우에 장소명을 표시합니다
          // mouseout 했을 때는 인포윈도우를 닫습니다
          (function (marker, store) {
            window.kakao.maps.event.addListener(marker, "mouseover", () => {
              displayInfowindow(marker, store);
            });

            window.kakao.maps.event.addListener(marker, "mouseout", () => {
              close();
            });
          })(marker, res.data.data[i]);

          // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
          // 인포윈도우에 장소명을 표시합니다
          const displayInfowindow = (marker, store) => {
            var content = '<div className="info_text">&nbsp;' + store.store_name + "</div>";
            this.state.infowindow.setContent(content);
            this.state.infowindow.open(this.map, marker);
          };

          const close = () => {
            this.state.infowindow.close();
          };
        }
        this.setState({
          stores: res.data.data,
          loading: false,
        });
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          loading: false,
        });
        alert("현재 식당정보를 받아오지 못하고 있습니다.\n잠시 뒤 다시 시도해주세요");
      });
  };

  makeMap = () => {
    var container = document.getElementById("map");
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(this.state.latitude, this.state.longitude), //지도의 중심좌표.
      level: 5, //지도의 레벨(확대, 축소 정도)
    };

    //  지도 생성
    this.map = new window.kakao.maps.Map(container, options);

    // 로그인했을때만 불러오기
    if (this.user) {
      this.axiosStores();
    }
  };

  render() {
    return (
      <div className="LikedMap">
        <div className="thumbnail">
          <div id="square" className="centered">
            <div id="map" className="kakaoMap"></div>
          </div>
        </div>

        <div className="backgroud">
          {!this.user && (
            <div className="login">
              <Emoji label="map" symbol="✔️" /> 로그인 후 즐겨찾기한 맛집을 확인해보세요!
            </div>
          )}
          {this.state.loading ? (
            <Loading></Loading>
          ) : (
            <>
              <div>
                {this.user && (
                  <span className="now_pos" onClick={this.onClickPos}>
                    현위치 설정
                  </span>
                )}
                {this.state.stores.length === 0 && this.user && (
                  <span className="no_store">
                    <Emoji label="map" symbol="⚙" /> 즐겨찾기한 식당이 없습니다
                  </span>
                )}
                {this.state.stores && this.state.stores.length !== 0 && this.user && (
                  <div>
                    <CarouselSlider similar={this.state.stores}></CarouselSlider>
                  </div>
                )}
                {this.user && (
                  <div className="more" onClick={() => this.props.history.push("/mypage/favorite")}>
                    <Emoji label="map" symbol="➕" /> 즐겨찾기한 식당 더보기
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(LikedMap);
