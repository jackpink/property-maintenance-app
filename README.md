# Property Maintenance App

## System Design

### Framework

This project was bootstapped with create-t3-app. So it is utilising NextJS 12 with Pages Router, Typescript and TRPC + React Query for type safe queries and mutations from the front to backend.

Having previously attempted to run a similar project from a SPA React app using AWS Rest API's linked to Lambda functions, this has been a far superior experience.

Being able to quickly spin up any custom query that the front end needs, then to import it and use with types, made building and updating this project so fast and easy.

### ORM

From create-t3-app Prisma was selected as the ORM. It was super easy to get the schema setup and pushed to my db. For basic queries it was very fast and easy to use. For more complicated or fine grained queries it was a large learning curve to figure out how to correctly write the query correctly in Prisma syntax. This was especially annoying as I knew exactly what the query would look like in SQL. I also didn't like that I had no idea how Prisma would implement these queries under the hood, I'm sure this wouldn't be an issue for my smaller project but I didn't like it nethertheless. 


