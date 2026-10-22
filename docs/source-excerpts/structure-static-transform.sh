#!/usr/bin/env bash
set -euo pipefail

exec ros2 run tf2_ros static_transform_publisher \
  --x 0.45 \
  --y 0 \
  --z 0.55 \
  --roll 0 \
  --pitch 0 \
  --yaw 0 \
  --frame-id base_link \
  --child-frame-id vehicle_blue/laser_frame/scan
