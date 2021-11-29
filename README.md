# Endpoints

## Links

- All endpoints have the following prefix api/v1/
- The endpoint documentation is on api/docs/

 <br />

# SQL

![Diagram io](/Back-end-portfolio.png)

 <br />

# Pros & Cons

## Pros

- Several roles are used in the database to improve authorization
- Tests cover all important database settings
- Well developed auth schema
- Easy-to-use endpoint documentation builded with _Swagger_
- All SQL query function could be reused in other projects

## Cons

- Query scripts doesn't provide proper check, if some SQL constrain rules are violeted. It just returns _undefined_ when an error is trown
