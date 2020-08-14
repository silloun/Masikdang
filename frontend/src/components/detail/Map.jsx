import React from "react";
import "./Map.scss";

class Map extends React.Component {

  componentDidMount() {
    var container = document.getElementById("map");
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new window.daum.maps.LatLng(
        this.props.latitude,
        this.props.longitude
      ), //지도의 중심좌표.
      level: 5, //지도의 레벨(확대, 축소 정도)
    };
    this.map = new window.daum.maps.Map(container, options);

    var imageSrc =
        "https://image.flaticon.com/icons/svg/854/854866.svg", // 마커이미지의 주소입니다
      imageSize = new window.daum.maps.Size(44, 49), // 마커이미지의 크기입니다
      imageOption = { offset: new window.daum.maps.Point(27, 45) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new window.daum.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      ),
      markerPosition = new window.daum.maps.LatLng(
        this.props.latitude,
        this.props.longitude
      ); // 마커가 표시될 위치입니다

    var marker = new window.daum.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });
    marker.setMap(this.map);
  }

  // 최대 10개까지만 이미지 보이게 하기
  render() {
    return (
      <div className="Map">
        <div className="thumbnailm">
          <div id="square" className="centeredm">
            <div id="map" className="kakaoMapm"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
