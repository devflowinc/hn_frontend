FROM rustlang/rust:nightly-slim AS chef
# We only pay the installation cost once, 
# it will be cached from the second build onwards
RUN apt-get update -y && apt-get -y install pkg-config libssl-dev libpq-dev g++ curl
RUN cargo install cargo-chef 
WORKDIR app

FROM chef AS planner
COPY . .
RUN cargo chef prepare  --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim as runtime
WORKDIR /app

RUN apt-get update -y; \
    apt-get install -y \
    pkg-config \
    build-essential\
    libssl-dev \
    libpq-dev \
    ca-certificates \
    ; \
    mkdir -p /app/tmp

COPY --from=builder /app/target/release/set-ids /app/set-ids-for-comments

EXPOSE 8090
ENTRYPOINT ["/app/set-ids-for-comments"]
