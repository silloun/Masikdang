# 마식당(Web+Bigdata project)

<p align="center"><img src="./frontend/public/logo.png" alt="스터디의발견" style="zoom:20%;" /></p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Web-green.svg"/>
  <img src="http://img.shields.io/badge/library-React-blue.svg"/>
  <img src="https://img.shields.io/badge/framework-Django-brightgreen.svg"/>
  <img src="https://img.shields.io/badge/database-MySQL-skyblue.svg"/>
  <img src="https://img.shields.io/badge/server-AWS-yellow.svg"/>
  <img src="https://img.shields.io/badge/language-Java, JavaScript, Python-orange.svg"/>
</p>

<p align="center">반응형 웹(Responsive Web) &nbsp;&nbsp;&nbsp;by. 송다은, 신상엽, 조서원, 한기연, 황정호</p>

<p align="center"><b>https://i02a201.p.ssafy.io</b></p>

<br />

## [목차]

1. [How to run 마식당](#How-to-run-마식당)
2. [서비스 소개](#서비스-소개)
3. [서비스 설명](#서비스-설명)
4. [개발 과정](#개발-과정)
5. [팀원 소개](#팀원-소개)

<br /><br /><br />

## How to run 마식당

### 접속 URL, 테스트 계정

Front : https://i02a201.p.ssafy.io

Back : https://i02a201.p.ssafy.io:8080

테스트 계정 : Google -  maskidang@gmail.com / 마식당201

<br />

### 개발환경

1. Python 설치
2. Node.js, NPM 설치

<br />

#### Frontend

```sh
cd frontend
npm install
npm run serve
```

<br />

#### Backend

```sh
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py initialize
python manage.py runserver
```

<br />

### 기술 스택

- Frontend :  React.js
- Backend : Django
- DB : MySQL

<br /><br />

## 서비스 소개

- 마식당만의 재미있는 **심리 테스트**, 마식는 타입 결과 제공
- 평생의 숙제, 오늘 먹을지?를 해결을 위한 **간편 설문**, 메뉴 추천
- 완벽한 **반응형 웹** 서비스
- 마식당만의 **빅데이터 재가공**

<br />

#### 서비스 소개 영상

[![Video Label](http://img.youtube.com/vi/5Zve17dYgQM/0.jpg)](https://youtu.be/5Zve17dYgQM?t=0s)

<br />

<br />

## 서비스 설명

### 1. 마식는 테스트(Bigdata Algorithm 적용)

- 사용자 흥미 유발 심리테스트, 음식 관련 재밌는 타입 결과로 제공
- 특이값 분해를 통해 이 타입의 유저들이 좋게 평가한 식당들 추천
- 여행 컨셉의 Test로 흥미을 유발해 사용자의 참여 독려
- **Algorithm : Item based filtering, Collaborative Filtering**
- path: /surveyStart

<br />

### 2. 오늘 뭐 먹지

- 간단한 설문 방식 적용

- 사용자들이 선택한 정보를 바탕으로, 타입에 맞는 음식 추천
- 사용자가 더보기 버튼을 클릭하면 검색 위치에 있는 음식점 검색으로 연결
- path: /whatToEatStart

<br />

### 3. 내 타입의 맛집(Bigdata Algorithm 적용)

- 메인 페이지 접속 후 로그인시 회원 맞춤 맛집 추천
- 유저 타입 회원들의 평점을 통계 내어 식당들 추천
- 해당 음식점과 유사한 평가를 받은 식당 추천
- **Algorithm : Matrix factorization, Collaborative Filtering**
- path: /home

<br />

### 4. 음식점 상세 정보

- 음식점의 이름, 메뉴, 태그, 평점, 영업 시간, 전화번호 리뷰, 주소, 위치 정보 등의 다양한 정보 제공

- 지도로 음식점 위치 확인 가능

- **알고리즘**이 적용된 이 식당을 좋아한 유저의 맛집, 유사한 카테고리 맛집 **추천** 정보 제공

- path : /search/550

  #### 3-1. 추천 - 리뷰(Bigdata Algorithm 적용)

  - 이 음식점을 평가한 사용자들의 데이터를 분석하여 비슷한 식당 추천

  - **Algorithm : Item based filtering, Collaborative Filtering**

  #### 3-2. 추천 - 카테고리(Bigdata Algorithm 적용)

  - 이 음식점의 카테고리를 분석하여 비슷한 카테고리의 식당 추천

  - **Algorithm : Content based filtering**

<br />

### 5. 검색

- 전체, 식당명, 지역, 카테고리 기준으로 4가지 필터 제공
- 전체 검색에서 지역, 식당명, 메뉴 등 원하는 정보를 한 번에 입력 및 검색 가능
- 뒤로 가기시 검색했던 값을 가지고 있어 새로 값을 받아오지 않아도 됨
- 무한스크롤링 구현, 원하는 정보를 빠르고 편리하게 확인 가능
- path: /search

<br />

### 6. 즐겨찾기

- 검색 결과 혹은 상세 화면에서 ❤ 클릭으로 간편하게 즐겨찾기 추가 가능

- 유저들이 원하는 식당을 즐겨찾기 해놓는 기능
- 메인에서 내 근처의 즐겨찾기한 식당을 간편하게 지도로 확인 가능
- 마이페이지에서 전체 목록 확인 가능
- path : /home

<BR />

### 7. 리뷰

- 전체 평가와 세분화된 3가지의 음식점 평가 정보 입력
- 내용 작성 및 여러 장의 사진 업로드 가능
- 이후, 수정 및 삭제, 작성 리뷰 전체보기 가능
- 더보기 버튼을 클릭해서 음식점의 리뷰 추가 확인 가능
- path : /search/841

<BR />

### 8. 지도

- 현재 위치를 받아와 주변의 평가가 좋은 음식점 추천
- 지도 이동 및 클릭을 통해 검색 위치를 변경 가능
- Zoom-in, out 기능을 활용해 받아오는 식당 정보의 범위 변경 가능
- 마커를 클릭하면 리스트에서 해당하는 음식점 설명 부분으로 스크롤 이동

- path: /map

<BR />

### 9. 마이페이지

- 즐겨찾기한 식당과 작성한 리뷰를 한번에 확인 가능
- 회원정보 확인 및 프로필 사진 변경 기능 제공

- path : /mypage

<BR />

### 10. 로그인, 회원가입

- 구글, 카카오 간편 로그인 기능 제공
- 마식는 테스트 후 간단한 정보만 입력하면 편리하게 로그인, 마식당의 다양한 서비스 이용 가능
- path: /login

<br /><br />

## 개발 과정

### Git Branch 구조

- master
  - dev
  - front
    - login
    - signup
    - ...
  - back
    - login
    - signup
    - ....
  - etc
    - readme/SY
    - readme/KY
    - data/JH
    - ...

<br />

### Commit Rule (누가 뭘 고쳤는지 보기 편함)

날짜 | 내용(영어로) | 이름(SY, 대문자), (JIRA 이슈번호)

0331 | update readme | SY, (JIRA 이슈번호)

dev 브랜치는 배포 할 때 front, back을 옮기는 용도

<br />

### 기획

- 우리 프로젝트의 차별성
  - 심리테스트 방식 : 타입 결과 제공
  - 설문 방식 : 메뉴 정보 제공

- [설문 문항](https://www.notion.so/ce88d80f98b541aa8e870806e8506bfc)

- [선정된 설문 문항](https://www.notion.so/2e25ee9d1f574313bab251a492c49b1d)

- [음식 분배](https://www.notion.so/77ece14f4a0d48139e397a890c86f741)

##### 설문 **방식**

1. 전생체험
   - 당신은 지금 밥을 먹으려고 합니다. 아침 / 점심 / 저녁
   - 지금 막 밥을 먹으러 문 밖으로 나왔습니다. 누구랑 밥을 먹으러 가시나요? 친구 / 연인 / 직장동료
   - 이제 식당으로 출발합니다. 걸어서 근처 / 차타고 멀리
   - 식당 문을 열고 들어갔습니다. 이곳의 분위기는 어떤가요?
2. 추천 방향
   - 처음에는 유저가 없으니 나열하듯이 해서 추천
   - 나중에는 비슷했던 사람이 좋다고 한 거
3. 설문 결과 방식
   - 귀차니즘 돼지 / 졸린 아나콘다
   - 동물로 할건지, 음식으로 할건지
   - 엄마가 해준 실패한 동코츠 라면 / 부장이 사준 맛없는 초밥
   - 맛만 좋은 / 이쁘기만 한
   - **3개 형식**
     - https://whykelly.tistory.com/entry/맛을-나타내는-형용사-모음Taste-Adjectives

- 데이터 수집은 Naver에서 새로 해야함
  - menu_list == null 인 값이 많음 크롤링 하던가 해야될 듯
  - naver datalab을 통한 데이터 제공을 안 하는 곳이 많음

- 회원 가입, DB 설계

- 성별 / 나이는 회원 가입으로 받기
- 음식 분석까지 가려니 너무 어려워짐

<br />

### 진행

- 카카오/ 구글 간편로그인, 회원가입
- front/back aws 배포

- 테스트, 설문 시나리오 제작
- 웹, 모바일 모두 가능한 반응형으로 개발
- 적용 가능 알고리즘 학습
- ...

<br /><br />

## 팀원 소개

#### Frontend

- **송다은**

  - <u>검색, 지도, 음식점 상세조회, 리뷰, 즐겨찾기, 홈페이지</u>

  - 저는 팀원들이 열심히 해서 어쩔 수 없이 열심히 했습니다... 9~24시 (27시?) 실화...?ヽ(°〇°)ﾉ

    완성도 높은 프로젝트를 만들어서 너무 뿌듯하고, 1등도 하고 싶습니다.

- **조서원**

  - <u>마식당테스트, 오늘뭐먹지? 마이페이지, 메인페이지, 홈페이지</u>

  - 처음 재택 환경에서 프로젝트를 진행하느라 낯설었지만 매일 줌에서 팀원들을 만나며 진행했기 때문에 좋은 결과물을 완성할 수 있었다고 생각합니다!

    다들 끝까지 열심해줘서 고마워!! (◕ᴗ◕✿)

#### Backend

- **신상엽**

  - <u>빅데이터 알고리즘, AWS 서버 관리, 배포</u>

  - 빅데이터는 처음 접하지만 알고리즘은 역시 재밌는 것 같습니다.

    많은 것을 배울 수 있었고 재밌는 경험을 해볼 수 있는 프로젝트였습니다.

    감사합니다. ٩(๑･ิᴗ･ิ)۶٩(･ิᴗ･ิ๑)۶

- **한기연**
  - <u>빅데이터 가공, 데이터 크롤링, REST API</u>
  - 음... 파이썬을 처음 사용해 미숙한 부분이 많았지만 좋은 팀원들이 있어 기획했던 의도대로 웹사이트가 잘 마무리 된것 같아 기분이 좋습니다. (o^-')b

- **황정호**
  - <u>Back, DB 총괄, REST API</u>
  - 코로나 때문에 힘든점이 이만저만이 아니었지만 끈끈한 팀워크로 극뽁 할 수 있었습니다.
  - 힘든 만큼 좋은 프로젝트가 나온것 같습니다.
  - 모든 영광을 우리 팀원들에게 바치겠습니다.  _( ͡° ͜ʖ ͡°)_/¯

