import os
# 获取当前目录下的所有文件
for root, dirs, files in os.walk('C:\\Users\\fengchuiyusan\\Desktop\\世界地图册\\codes\\WorldMap\\pages\\static\\nationFlags'):
    for file in files:
        # 截取文件名
        name = file.split('.')[0]
        # 将文件名中的空格替换为%20并重命名文件
        os.rename(os.path.join(root, file), os.path.join(root, name.replace(' ', '%20') + '.gif'))