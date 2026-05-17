# 1. 什么是Docker？
## 1.1 Docker简介
> [!note] Docker的本质
> Docker 是一个开源容器化平台，通过**容器技术**实现应用程序与基础设施的解耦。其核心价值在于：
> - 提供标准化的开发/测试/生产环境
> - 实现应用的快速部署与扩展
> - 通过镜像机制确保环境一致性

> [!note] Docker容器的特性
> 容器是轻量级的**操作系统级虚拟化**技术，具有以下特点：
> - 与宿主机共享内核，但拥有独立的文件系统
> - 启动时间仅需秒级（对比虚拟机的分钟级）
> - 资源占用更少（通常为MB级镜像）
> - 支持跨平台运行（开发机/云服务器/混合环境）

## 1.2 Docker 与传统虚拟化的区别

|  特性  |     虚拟机     |  Docker容器  |
| :--: | :---------: | :--------: |
| 隔离级别 |   硬件级别虚拟化   | 操作系统级别虚拟化  |
| 操作系统 | 每个VM需要完整的OS | 共享宿主机的OS内核 |
| 资源占用 | 重量级，占用较多资源  | 轻量级，资源占用少  |
| 启动时间 |    分钟级别     |    秒级别     |
| 性能开销 |     较大      |   接近原生性能   |
| 镜像大小 |    GB级别     |    MB级别    |
> [!tip] 容器 vs 虚拟机
> 容器**更适合微服务架构和快速部署场景**，而虚拟机更适合需要完全系统隔离的场景。例如：容器可快速部署多个独立服务，虚拟机更适合运行不同操作系统需求的服务。
 
## 1.3 Docker 的核心优势
1. **环境一致性**
	- 通过镜像确保开发/测试/生产环境完全一致
	- 示例：`docker run --rm -it ubuntu:latest bash` 可快速创建临时开发环境
2. **资源高效利用**
    - 单台服务器可运行数百个容器（对比虚拟机的几十个）
    - 支持动态资源分配，如 Kubernetes 的 HPA 自动扩缩容
3. **快速迭代能力**
    - 镜像缓存机制加速构建
    - 多阶段构建技术减少镜像体积（如构建时删除中间文件）

--- 

# 2. 安装与配置
## 2.1 不同系统的安装指南
- **Linux**：使用官方脚本安装 `curl -fsSL https://get.docker.com | bash`
- **macOS**：通过 Docker Desktop 安装（需 Homebrew 前置）
- **Windows**：Docker Desktop 支持 WSL2（需 Windows 10 2004+）

## 2.2 镜像加速器配置
```yaml
# /etc/docker/daemon.json 示例
{
  "registry-mirrors": ["https://hub-mirror.c.163.com", "https://docker.mirrors.ustc.edu"]
}
```

> [!tip] 配置后需重启 Docker 服务：
> `sudo systemctl restart docker`

# 3. 核心概念解析

## 3.1 Docker 架构

- **客户端-守护进程模型**：客户端发送指令，守护进程处理容器生命周期
- **镜像仓库体系**：Docker Hub（公共）/私有仓库（企业级）
- **容器生命周期**：创建→运行→停止→删除

## 3.2 关键组件

- **镜像（Image）**：只读模板（如 `nginx:latest`）
- **容器（Container）**：镜像的运行时实例（如 `docker run nginx`）
- **仓库（Repository）**：存储镜像的中心（如 `library/ubuntu`）
- **Dockerfile**：构建镜像的配方文件（示例：`FROM ubuntu:20.04`）
- **Volume**：持久化存储（支持跨容器共享数据）

# 4. 容器管理

## 4.1 基础操作

- `docker run` 命令详解
- `docker start/stop/restart` 管理
- `docker rm` 容器删除
- `docker ps` 查看运行状态

## 4.2 日志与监控

- `docker logs` 查看日志
- 容器资源监控（CPU/内存/网络）
- 自定义日志配置

# 5. 镜像管理

## 5.1 镜像构建

- Dockerfile 语法规范
- 多阶段构建技术
- 镜像缓存机制

## 5.2 镜像操作

- `docker build` 构建流程
- `docker push` 仓库推送
- 镜像标签管理
- 镜像分层原理

# 6. 网络与存储

## 6.1 网络配置

- 默认网络模式（bridge/host/none）
- 自定义网络创建
- 容器互联（link/network）
- 端口映射规则

## 6.2 存储方案

- 数据卷（Volume）管理
- 绑定挂载（Bind Mount）
- tmpfs 挂载特性
- 存储驱动类型

# 7. 容器编排

## 7.1 Docker Compose

- YAML 文件结构
- 服务依赖管理
- 网络/存储配置
- 多容器应用部署

## 7.2 Kubernetes

- 核心概念（Pod/Deployment/Service）
- 容器编排优势
- 与 Docker 的关系区别

# 8. 最佳实践

- 容器命名规范
- 镜像版本控制策略
- 安全加固措施（非root运行/限制权限）
- 生产环境配置建议
- 多阶段构建优化

# 9. 进阶话题

- 自定义网络配置
- 容器安全策略（SELinux/AppArmor）
- 性能调优技巧
- 容器调试方法
- 与CI/CD工具集成

# 10. 实战案例

## 10.1 部署MySQL
> [!attention] 部署之前的隐患及解决方案
> ## ***隐患***
> 由于Docker是基于WSL服务，而WSL服务占用了3306端口，这可能导致端口冲突导致MySQL无法正常启动，此外，本机上部署的MySQL也可能与Docker中的数据库冲突
> 
> ## ***解决方案***
> - 如果确定了要使用Docker中部署的数据库，并且决定要移除本机的MySQL，我们可以在对原数据库的内容进行备份后（如将所有数据库的ddl导出并统一存储），移除本机的MySQL服务，首先排除掉本机MySQL与Docker中的MySQL的冲突，步骤如下：
> 	- 停止并删除 MySQL 服务
> 	```powershell
> 	# 首先查询服务名
> 	sc queryex type=service | findstr /i "mysql"
> 	# 停止 MySQL 服务（若正在运行）
> 	net stop MySQL
> 	# 删除 MySQL 服务（以 "MySQL" 开头的服务名）
> 	sc delete MySQL
> 	```
> 	- 终止残留的进程
> 	```powershell
> 	# 强制结束所有的 MySQL 相关进程
> 	Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
> 	Stop-Process -Name mysql -Force -ErrorAction SilentlyContinue
> 	```
> 	- 清理注册表选项
> 	```powershell
> 	# 删除服务注册表项（防止服务残留）
> 	Remove-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Services\MySQL*" -Recurse -ErrorAction SilentlyContinue
> 	# 删除软件注册信息
> 	Remove-Item -Path "HKLM:\SOFTWARE\MySQL AB" -Recurse -ErrorAction SilentlyContinue
> 	Remove-Item -Path "HKLM:\SOFTWARE\MySQL Inc." -Recurse -ErrorAction SilentlyContinue
> 	```
> 	- 删除数据与安装目录
> 	```powershell
> 	# 删除默认安装目录
> 	Remove-Item -Path "C:\Program Files\MySQL" -Recurse -Force -ErrorAction SilentlyContinue
> 	Remove-Item -Path "C:\Program Files (x86)\MySQL" -Recurse -Force -ErrorAction SilentlyContinue
> 	# 删除数据目录（如果有自定义目录，请同步清理）
> 	Remove-Item -Path "C:\ProgramData\MySQL" -Recurse -Force -ErrorAction SilentlyContinue
> 	```
> 
> - **创建独立的Docker自定义网络**：虽然端口冲突本身无法通过网络解决，但**使用自定义网络可避免与其他容器的 IP/服务名冲突，并提升整体架构清晰度**。更重要的是，它为后续 Nacos 等服务通过容器名（如 `mysql`）访问数据库提供了基础
> 	- 创建名为 *app-net* 的自定义bridge网络
> 	```powershell
> 	# 创建自定义网络
> 	docker network create app-net
> 	```

> [!tip] 部署步骤
> - 拉取MySQL镜像
> 截至2025，MySQL 最稳定且广泛支持的镜像版本为 8.0.39，首先在终端进行镜像的拉取
> ```powershell
> docker pull mysql:8.0.39
> ```
> 
> - 启动MySQL容器
> 使用以下命令启动MySQL容器，并配置持久化存储、网络隔离和安全访问策略
> **注意：需要在命令中显式指定我们创建的自定义网络**
> ```powershell
> docker run -d `
>  --name mysql `
>  --restart=unless-stopped `
>  --network app-net `
>  -p 3306:3306 `
>  -v E:/Docker/MySQL/data:/var/lib/mysql `
>  -v E:/Docker/MySQL/conf:/etc/mysql/conf.d `
>  -e MYSQL_ROOT_PASSWORD=Root@123456 `
>  mysql:8.0.39 `
>  --bind-address=0.0.0.0  # 配置bind-address允许外部访问
> ```
> 
> - 容器启动后验证容器是否能够正常运行
> 如果能够正常运行，用户可以自己选择是否要创建自定义用户进行操作


## 10.2 部署Nacos
> [!tip] 部署前须知
> 1. Nacos 3.1.1 新增的安全认证参数（缺失将导致启动失败）
> 从 Nacos 2.2.0 开始，官方默认启用了更严格的身份验证机制，到3.1.1版本，如果没有显式配置以下三个环境变量，服务将无法启动（`exit 255`）。因此必须通过环境变量提供以下三项安全凭证：
> 	- **NACOS_AUTH_IDENTITY_KEY**：身份标识密钥（16~32位非空字符串）
> 	- **NACOS_AUTH_IDENTITY_VALUE**：身份标识值（32~64位非空字符串）
> 	- **NACOS_AUTH_TOKEN**：JWT 加密密钥（32~64位非空字符串）
> ```powershell
># 生成 NACOS_AUTH_IDENTITY_KEY (16~32 字符)
>$Key = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16))
>Write-Host "NACOS_AUTH_IDENTITY_KEY: $Key"
>
># 生成 NACOS_AUTH_IDENTITY_VALUE (32~64 字符)
>$Value = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
>Write-Host "NACOS_AUTH_IDENTITY_VALUE: $Value"
>
># 生成 NACOS_AUTH_TOKEN (32~64 字符)
>$Token = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
>Write-Host "NACOS_AUTH_TOKEN: $Token"
> ```
> 2. 配置数据库
> 生产环境下推荐使用MySQL，以下是完整配置流程：
> 	- 在已经部署好的MySQL中新建`nacos_config`数据库并初始化表：
> 	```sql
> 	CREATE DATABASE IF NOT EXISTS nacos_config CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> 	use nacos_config;
> 	```
> 	通过这条链接获取完整的SQL语句并在创建数据表：
> 	[nacos/distribution/conf/mysql-schema.sql at develop · alibaba/nacos](https://github.com/alibaba/nacos/blob/develop/distribution/conf/mysql-schema.sql)
> 	- 验证数据表无误后，即可开始部署

> [!summary] 部署步骤
> 1. 通过在命令中显式指定如下内容：
> 	- 自定义的Docker网络
> 	- 三个安全参数
> 	- 数据库相关的内容
> 完整命令如下：
> ```powershell
> docker run -d `
>  --name nacos `
>  --restart=unless-stopped ` #设置开机自启动
>  --network app-net ` #显式使用自定义网络
>  -p 8848:8848 `
>  -p 9848:9848 `
>  -p 8080:8080 `
>  -v E:/Docker/Nacos/data:/home/nacos/data ` 
>  -v E:/Docker/Nacos/logs:/home/nacos/logs `
>  -e MODE=standalone `
>  -e PREFER_HOST_MODE=true `
>  -e SPRING_DATASOURCE_PLATFORM=mysql `
>  -e MYSQL_SERVICE_HOST=mysql `
>  -e MYSQL_SERVICE_PORT=3306 `
>  -e MYSQL_SERVICE_DB_NAME=nacos_config `
>  -e MYSQL_SERVICE_USER= #你数据库使用的用户 `
>  -e MYSQL_SERVICE_PASSWORD= #对应用户的密码 `
>  -e NACOS_AUTH_IDENTITY_KEY= #你的key `
>  -e NACOS_AUTH_IDENTITY_VALUE= #你的value `
>  -e NACOS_AUTH_TOKEN= #你的token `
>  nacos/nacos-server:v3.1.1
> ```
> 2. 验证是否部署成功
> 	- 检查日志
> 	```powershell
> 	docker logs nacos;
> 	```
> 	应该出现：
> 	```text
> 	Nacos started successfully in stand alone mode.
> 	Connected to database successfully.
> 	```
> 	- 访问控制台
> 	访问[http://localhost:8848/nacos]，默认账密：nacos/nacos

## 10.3 部署Redis

## 10.4 部署RabbitMQ

## 10.5 部署Sentinel-Dashboard
> [!note] 部署前须知
> 由于之前在部署MySQL的时候创建了自定义网络，因此在部署Sentinel时也要显式指定这个网络

> [!tip] 部署过程
> ## *拉取镜像*
> ```powershell
> docker pull bladex/sentinel-dashboard
> ```
> 注意镜像源的选择，官方的镜像是 bladex/sentinel-dashboard
> ## *启动容器*
> ```powershell
> docker run -d `
  >--name sentinel-dashboard `
  >--network app-net `
  >--restart unless-stopped `
  >-p 8719:8719 `
  >-p 8858:8858 `
  >-v "E:\Docker\Sentinel\data:/data" `
  >-v "E:\Docker\Sentinel\logs:/logs" `
  >-e "JAVA_OPTS=-Dserver.port=8858 -Dcsp.sentinel.dashboard.server=sentinel-dashboard:8858 -Dproject.name=sentinel-dashboard" `
  >bladex/sentinel-dashboard:1.8.7
> ```
> 启动成功后访问[http://localhost:8858]()，默认账密为 sentinel/sentinel 如果没有问题则部署完成

## 10.6 部署Consul
> [!summary] 使用配置文件挂载的方式启动Consul
> ## *拉取镜像(指定版本)*
> ```powershell
> # 选用稳定版本
> docker pull hashicorp/consul:1.19.2 
> ```
> ## *启动容器*
> - 在启动之前先配置本地目录结构：
> ```text
> E:\Docker\Consul
>├── conf/
>│   └── consul.json         ← 配置文件
>├── data/                   ← 数据持久化
>└── logs/                   ← 日志输出
> ```
> 在conf目录下`consul.json`文件，内容编写如下：
> ```json
> {
>  "bootstrap_expect": 1, // 表示单节点集群（开发使用）
>  "server": true,
>  "ui": true,
>  "bind_addr": "0.0.0.0",
>  "client_addr": "0.0.0.0"
>}
> ```
> 
> - 启动容器
> ```powershell
>docker run -d `
>--name consul `
>--network app-net `
>--restart unless-stopped `
>-p 8500:8500 `
>-p 8301:8301 `
>-p 8301:8301/udp `
>-p 8600:8600/udp `
>-v "E:\Docker\Consul\data:/consul/data" `
>-v "E:\Docker\Consul\logs:/consul/logs" `
>-v "E:\Docker\Consul\conf:/consul/config" `
>hashicorp/consul:1.19.2
> ```
> - 验证启动是否成功
> 	- 查看容器状态：
> 	```powershell
> 	docker ps -f name=consul
> 	```
> 	- 查看日志：
> 	```powershell
> 	docker logs consul
> 	```
> 	- 访问Web UI：访问 [http://localhost:8500]()
> 	

