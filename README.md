<br/><h1 align="center">Fintech payment</h1>
은행권 공동 오픈뱅킹 API를 사용하여 간편 결재 프로그램을 구현했다.<br/>
해당 프로그램의 기능으로는 잔액 충전, QR 코드를 통한 결제 구현, 잔액 조회가 있다.<br/><br/>

- 개발 환경


| DBMS | Server Side | Front-End |
|:----:|:----:|:----:|
| MySQL | ExpressJS, NODE JS | Bootstrap, Jqeury|

[은행권 공동 오픈뱅킹 API 개발자 사이트](https://developers.kftc.or.kr/dev) 이용<br/><br/>

# 사전 준비
은행권 공동 오픈뱅킹에 회원가입 한 후 프로그래밍을 위해 필요한 Access Token, API Key, API secret을 발급 받는다. 서비스 개발을 위해 임의로 생성한 고객들의 계좌에 접근할 때 서버 단에서 필요하기 때문이다.<br/>
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109420594-b9341700-7a16-11eb-8147-bf93059a35dd.png" width="70%" height="70%">
</div>
API Key를 발급을 받은 뒤 입금이체 API, 출금이체 API 등을 사용한 기능 구현을 위해 테스트용 계좌 정보를 등록한다.<br/>
이와 같은 사전등록은 오픈뱅킹 개발자 사이트의 '마이페이지-테스트 정보관리'에서 수행할 수 있다.<br/><br/>
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109420905-488dfa00-7a18-11eb-80d9-01b26c285467.png" width="60%" height="60%">
  <img src="https://user-images.githubusercontent.com/45943080/109420915-5f345100-7a18-11eb-8572-262dce5e7540.png" width="60%" height="60%">
</div><br/><br/><br/>
 

## 로그인 및 회원가입
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109421814-4037be00-7a1c-11eb-81eb-acbc89024369.png" width="30%" height="30%">
  <img src="https://user-images.githubusercontent.com/45943080/109421824-4fb70700-7a1c-11eb-9287-f1789f1d411e.png" width="30%" height="30%">
</div><br/>
회원가입 창에서 '인증받기'를 클릭하면 Oauth2.0을 통한 개인 인증 페이지가 뜬다.<br/>
개인 인증과 계좌 계설을 완료하고 회원가입을 하면 사용자 정보와 Access Token이 MySQL에 저장된다.
<img src="https://user-images.githubusercontent.com/45943080/109421800-2eeeb180-7a1c-11eb-899c-78f46a4d27eb.png" width="30%" height="30%"><br/>
회원가입을 완료하면, Access Token을 입력하지 않아도 MySQL에 저장된 데이터를 통해 로그인을 할 수 있다.<br/><br/><br/>

## 계좌 확인 및 잔액 조회
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109422452-e389d280-7a1e-11eb-9e8a-d08662781b06.png" width="30%" height="30%">
  <img src="https://user-images.githubusercontent.com/45943080/109421939-ce13a900-7a1c-11eb-9e88-90a5cb58810d.png" width="30%" height="30%">
</div><br/>
로그인을 완료하면, 계좌를 확인할 수 있는 페이지로 넘어간다.<br/>
오픈뱅킹 개발자 사이트에서 수행 한 사전 등록을 통해 생성한 test 계좌가 출력되는 것을 알 수 있다.<br/>
계좌 칸 내부에 위치한 잔액 조회 버튼을 클릭하면 오픈 뱅킹의 사용자인증(3-legged)를 통하여 등록된 사용자 계좌의 금융 정보를 조회할 수 있다. 서버 단에 계좌 종류 및 상품명이 함께 전달되며 이를 출력한다.<br/><br/><br/>

## QR 코드 생성
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109422460-f2708500-7a1e-11eb-9411-230d88ca0342.png" width="30%" height="30%">
  <img src="https://user-images.githubusercontent.com/45943080/109422175-cacced00-7a1d-11eb-9eff-7796e04cef37.png" width="30%" height="30%">
</div><br/>
큐알 생성 버튼을 클릭하면 사용자 정보를 담은 큐알 코드가 생성된다.<br/>
큐알 코드 관련은 [오픈 소스](https://jeromeetienne.github.io/jquery-qrcode)를 사용했다.<br/><br/>br/>

## QR 코드 결제
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109422204-eafcac00-7a1d-11eb-8147-3d8cfcc58901.png" width="30%" height="30%">
  <img src="https://user-images.githubusercontent.com/45943080/109422216-f51eaa80-7a1d-11eb-84de-2cb92b858c9e.png" width="30%" height="30%">
</div><br/>

