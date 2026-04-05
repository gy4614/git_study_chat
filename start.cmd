# start.cmd = Windows 版“一键启动前后端”的脚本用start开新窗口运行任务
cd ./service
start pnpm start > service.log &
echo "Start service complete!"


cd ..
echo "" > front.log
start pnpm dev > front.log &
echo "Start front complete!"
