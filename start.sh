# 这个脚本 = 同时启动 service（后端）和 front（前端），并记录日志到 service.log 和 front.log 文件
cd ./service
nohup pnpm start > service.log &  
# pnpm start 启动后端服务  nohup 让程序在后台运行，即使你关闭终端也不会停止  > service.log 把输出写入日志文件
echo "Start service complete!"  # 打印提示信息，说明后端服务启动完成


cd ..  
  # 切换到上一级目录，即项目根目录
echo "" > front.log  # 清空日志文件，确保每次启动时都有新的日志
nohup pnpm dev > front.log &  
# pnpm dev 启动前端服务  nohup 让程序在后台运行，即使你关闭终端也不会停止  > front.log 把输出写入日志文件
echo "Start front complete!"  # 打印提示信息，说明前端服务启动完成
tail -f front.log  # 实时监控日志文件，查看前端服务启动结果
