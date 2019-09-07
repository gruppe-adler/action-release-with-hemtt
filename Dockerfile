FROM alpine:3.10

COPY entrypoint.sh /entrypoint.sh
COPY hemtt /hemtt

ENTRYPOINT ["/entrypoint.sh"]