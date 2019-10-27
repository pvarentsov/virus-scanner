#!/bin/bash

set -m

freshclam -d &
clamd
