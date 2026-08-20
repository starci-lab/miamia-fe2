# Mia Mia — Frontend

Next.js application for Mia Mia: phrase-based English learning, exam practice and the multiplayer
game client.

[![CI](https://github.com/starci-lab/miamia-fe2/actions/workflows/ci.yml/badge.svg)](https://github.com/starci-lab/miamia-fe2/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/starci-lab/miamia-fe2/graph/badge.svg?token=6R6Z6A81QP)](https://codecov.io/gh/starci-lab/miamia-fe2)
[![SonarQube Quality Gate](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=alert_status&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Coverage](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=coverage&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Bugs](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=bugs&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Vulnerabilities](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=vulnerabilities&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Code Smells](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=code_smells&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Maintainability](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=sqale_rating&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Reliability](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=reliability_rating&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![SonarQube Security](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=security_rating&token=sqb_c5539124f652288b73d7c01892464be2344e45a9)](https://sonar.starci.org/dashboard?id=miamia-fe)

## Running it

```bash
npm install
npm run dev
```

The dev server listens on **http://localhost:3071**. Open it by that exact hostname and port: the
generated CORS and session origin is `http://localhost:3071`, so reaching the app through
`127.0.0.1` or another port produces CORS, cookie or `Invalid parameter: redirect_uri` failures.
That redirect-URI whitelist lives in the running Keycloak and is not seeded from this repository.

## Gates

`npm run verify` runs the three that decide a merge — typecheck, lint, unit tests. `.husky/pre-push`
runs the same three locally so a push cannot be the first place they fail.

Coverage is measured and reported but does not refuse a merge; see the reasoning in
[codecov.yml](codecov.yml). The SonarQube quality gate does block, and CI waits for its verdict
rather than treating a successful upload as a pass.
