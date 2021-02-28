<br/><h1 align="center">Fintech payment</h1>
은행권 공동 오픈뱅킹 API를 사용하여 간편 결재 프로그램을 구현했다.<br/>
해당 프로그램의 기능으로는 잔액 충전, QR 코드를 통한 결제 구현, 잔액 조회가 있다.<br/><br/>

- 개발 환경


| DBMS | Server Side | Front-End |
|:----:|:----:|:----:|
| MySQL | ExpressJS, NODE JS | Bootstrap, Jqeury|

[은행권 공동 오픈뱅킹 API 개발자 사이트](https://developers.kftc.or.kr/dev) 이용<br/><br/>

 ## 사전 준비
은행권 공동 오픈뱅킹에 회원가입 한 후 프로그래밍을 위해 필요한 Access Token, API Key, API secret을 발급 받는다. 서비스 개발을 위해 임의로 생성한 고객들의 계좌에 접근할 때 서버 단에서 필요하기 때문이다.<br/>
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109420594-b9341700-7a16-11eb-8147-bf93059a35dd.png" width="60%" height="60%">
</div>
API Key를 발급을 받은 뒤 입금이체 API, 출금이체 API 등을 사용한 기능 구현을 위해 테스트용 계좌 정보를 등록한다. 이와 같은 사전 등록은 오픈뱅킹 개발자 사이트의 '마이페이지-테스트 정보관리'에서 수행할 수 있다.<br/>
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109420905-488dfa00-7a18-11eb-80d9-01b26c285467.png" width="50%" height="50%">
  <img src="https://user-images.githubusercontent.com/45943080/109420915-5f345100-7a18-11eb-8572-262dce5e7540.png" width="50%" height="50%">
</div><br/><br/>
 
## 프로젝트 구조 설명
1. 로그인 및 회원가입
<div>
  <img src="https://user-images.githubusercontent.com/45943080/109421087-3496c800-7a19-11eb-8e61-76fdf372e506.png" width="25%" height="25%">
  <img src="https://user-images.githubusercontent.com/45943080/109421130-69a31a80-7a19-11eb-8ae9-044ffb4a737e.png" width="25%" height="25%">
</div><br/>
회원가입 창에서 인증하기를 클릭하면 Oauth2.0을 통한 개인 인증 페이지가 뜬다. 개인 인증과 계좌 계설을 완료하고 회원가입을 하면 사용자 정보와 Access Token이 MySQL에 저장된다.
<img src="https://user-images.githubusercontent.com/45943080/109421164-91927e00-7a19-11eb-93a5-87de0ab8d01f.png" width="25%" height="25%"><br/>
회원가입을 완료하면, Access Token을 입력하지 않아도 MySQL에 저장된 데이터를 통해 로그인을 할 수 있다.





# 잔액 조회
오픈 뱅킹에 사용자인증(3-legged)를 통하여 등록된 사용자 계좌의 금융 정보를 조회한다. 서버 단에 계좌 종류 및 상품명이 함께 전달된다.
