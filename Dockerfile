FROM debian:bullseye as builder

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=19.8.1

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential git jq libpq-dev && \
    curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
rm -rf /tmp/node-build-master

RUN mkdir /app
WORKDIR /app

# Explicitly clone the foundry repo in docker for caching purposes
COPY ./Makefile .
RUN ssh -o "StrictHostKeyChecking=no" git@github.com || true # Ensure the host key for github is saved
RUN make foundry_dir
RUN git config --global --add safe.directory /app/build/foundryvtt-pf2e

COPY . .

RUN make build
RUN make items.db.json

FROM debian:bullseye-slim

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /usr/local/node /usr/local/node
COPY --from=builder /app/build/ /app
COPY --from=builder /app/client/build /app/public/
COPY --from=builder /app/migrations /app/migrations

# necessary to run node-pg-migrate
COPY --from=builder /app/node_modules /app/node_modules 

WORKDIR /app
ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH

USER 1001:1001

CMD [ "node",  "./serve.ts" ]
