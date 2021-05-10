FROM ubuntu:latest

ENV CLAMAV_VERSION=0.103.2
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y \
        build-essential \
        gnupg \
        dirmngr \
        openssl \
        libssl-dev \
        libxml2-dev \
        libxml2 \
        libbz2-dev \
        bzip2 \
        zlib1g \
        zlib1g-dev \
        gettext \
        autoconf \
        libjson-c-dev \
        ncurses-dev \
        libpcre3-dev \
        check \
        valgrind \
        libcurl4-openssl-dev \
        ca-certificates \
        wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY talos.pub /tmp/talos.pub

# Download and build ClamAV

RUN wget -nv https://www.clamav.net/downloads/production/clamav-${CLAMAV_VERSION}.tar.gz && \
    wget -nv https://www.clamav.net/downloads/production/clamav-${CLAMAV_VERSION}.tar.gz.sig &&  \
    gpg --import /tmp/talos.pub && \
    gpg --decrypt clamav-${CLAMAV_VERSION}.tar.gz.sig && \
    tar xzf clamav-${CLAMAV_VERSION}.tar.gz && \
    cd clamav-${CLAMAV_VERSION} && \
    ./configure && \
    make && make install && \
    rm -rf /clamav-${CLAMAV_VERSION} && \
    rm -rf /tmp/talos.pub

# Add ClamAV user

RUN groupadd -r clamav && \
    useradd -r -g clamav -u 1000 clamav -d /var/lib/clamav && \
    mkdir -p /var/lib/clamav && \
    mkdir /usr/local/share/clamav && \
    chown -R clamav:clamav /var/lib/clamav /usr/local/share/clamav

# Configure ClamAV

RUN chown clamav:clamav -R /usr/local/etc/
COPY --chown=clamav:clamav ./*.conf /usr/local/etc/

RUN cp /usr/local/lib/libclamav.so.* /usr/lib/x86_64-linux-gnu && \
    cp /usr/local/lib/libfreshclam.so.* /usr/lib/x86_64-linux-gnu && \
    cp /usr/local/lib/libclammspack.so.* /usr/lib/x86_64-linux-gnu && \
    cp /usr/local/lib/libclamunrar_iface.so.* /usr/lib/x86_64-linux-gnu && \
    cp /usr/local/lib/libclamunrar.so.* /usr/lib/x86_64-linux-gnu

RUN freshclam && \
    chown clamav:clamav /var/lib/clamav/*.cvd

# Add permissions

RUN mkdir /var/run/clamav && \
    chown clamav:clamav /var/run/clamav && \
    chmod 750 /var/run/clamav

USER 1000

VOLUME /var/lib/clamav

COPY --chown=clamav:clamav docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3310
