# Mia Mia — Frontend

Next.js application for Mia Mia: phrase-based English learning, exam practice and the multiplayer
game client.

[![CI](https://github.com/starci-lab/miamia-fe2/actions/workflows/ci.yml/badge.svg)](https://github.com/starci-lab/miamia-fe2/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/starci-lab/miamia-fe2/graph/badge.svg)](https://codecov.io/gh/starci-lab/miamia-fe2)
[![Quality gate](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=alert_status)](https://sonar.starci.org/dashboard?id=miamia-fe)
[![Coverage](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=coverage)](https://sonar.starci.org/component_measures?id=miamia-fe&metric=coverage)
[![Bugs](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=bugs)](https://sonar.starci.org/project/issues?id=miamia-fe&types=BUG)
[![Vulnerabilities](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=vulnerabilities)](https://sonar.starci.org/project/issues?id=miamia-fe&types=VULNERABILITY)
[![Code smells](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=code_smells)](https://sonar.starci.org/project/issues?id=miamia-fe&types=CODE_SMELL)
[![Maintainability](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=sqale_rating)](https://sonar.starci.org/component_measures?id=miamia-fe&metric=Maintainability)
[![Reliability](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=reliability_rating)](https://sonar.starci.org/component_measures?id=miamia-fe&metric=Reliability)
[![Security](https://sonar.starci.org/api/project_badges/measure?project=miamia-fe&metric=security_rating)](https://sonar.starci.org/component_measures?id=miamia-fe&metric=Security)

## Running it

```bash
npm install
npm run dev
```

The dev server listens on **http://localhost:3070**. Open it by that exact hostname and port: the
generated CORS and session origin is `http://localhost:3070`, so reaching the app through
`127.0.0.1` or another port produces CORS, cookie or `Invalid parameter: redirect_uri` failures.
That redirect-URI whitelist lives in the running Keycloak and is not seeded from this repository.

## Gates

`npm run verify` runs the three that decide a merge — typecheck, lint, unit tests. `.husky/pre-push`
runs the same three locally so a push cannot be the first place they fail.

Coverage is measured and reported but does not refuse a merge; see the reasoning in
[codecov.yml](codecov.yml). The SonarQube quality gate does block, and CI waits for its verdict
rather than treating a successful upload as a pass.
