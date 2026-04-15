---
---

# Установка, настройка, безопасность и использование панели 3X-UI для VPN

---

## Что такое 3X-UI

**3X-UI** — это продвинутая веб-панель с открытым исходным кодом для управления ядром **Xray-core**. Позволяет создавать и управлять VPN-подключениями через веб-интерфейс, без ручного редактирования конфигурационных файлов.

**Поддерживаемые протоколы:** VLESS, VMess, Trojan, Shadowsocks, WireGuard, Socks, HTTP, Modem-door

**Поддерживаемые транспорты:** TCP, WebSocket, gRPC, HTTPUpgrade, XHTTP, REALITY, XTLS (Vision, Direct)

> 📌 Официальный репозиторий: [github.com/MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui)
> 📌 Официальная Wiki: [github.com/MHSanaei/3x-ui/wiki](https://github.com/MHSanaei/3x-ui/wiki)

---

## 1. Подготовка сервера

### 1.1 Требования к серверу

| Параметр | Минимум (1–3 пользователя) | Рекомендуется (10–50 пользователей) |
|---|---|---|
| CPU | 1 vCore, 1 GHz | 2–4 vCore |
| RAM | 512 MB | 2–4 GB |
| Диск | 5 GB (SSD) | 20+ GB (SSD/NVMe) |
| Сеть | 10 Mbps | 100+ Mbps |
| ОС | Debian 11/12, Ubuntu 22.04+ | Ubuntu 22.04 LTS / Debian 12 |

> 📌 Источник: [3x-ui.com/system-requirements](https://3x-ui.com/what-are-3x-ui-system-requirements/)

### 1.2 Начальная настройка сервера

Перед установкой 3X-UI выполните базовую подготовку сервера:

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка необходимых пакетов
apt install wget curl -y
```

### 1.3 Настройка SSH

Следуйте инструкции из предыдущей статьи: генерация ключей, отключение входа по паролю, запрет root-входа, смена порта, настройка firewall.

> ⚠️ **Критически важно:** Не закрывайте текущую SSH-сессию, пока не убедитесь, что вход по новому порту работает.

---

## 2. Установка 3X-UI

### 2.1 Стандартная установка (рекомендуется)

Из официальной инструкции нужно сделать так:
```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```
Но так у меня не устанавливается. Поэтому я делаю так:
#### Качаю скрипт 
```bash
curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh -o install.sh
```
```bash
chmod +x install.sh
sudo bash install.sh
```

В процессе установки скрипт задаст вопросы:

1. **Would you like to customize the Panel Port settings? (If not, a random port will be applied) [y/n]:**   **Настроить порт панели?** → Ответьте `y` и укажите нестандартный порт из диапазона **41000–65000** (например, `54321`)
2. **For security, SSL certificate is required for all panels.
   Let's Encrypt now supports both domains and IP addresses!** - Предложение установить сертификат SSL. Он нужен для панели управления. Я тут выбрал 1 вариант для домена.
3. **Please enter your domain name:** 

После установки вы увидите:

```
###############################################
Username: ваш_логин
Password: ваш_пароль
Port: 54321
###############################################
```

> 📌 Источник: [github.com/MHSanaei/3x-ui — Quick Start](https://github.com/MHSanaei/3x-ui)

**Сохраните эти данные!**

### 2.2 Установка через Docker

```bash
# 1. Установить Docker
bash <(curl -sSL https://get.docker.com)

# 2. Клонировать репозиторий
git clone https://github.com/MHSanaei/3x-ui.git
cd 3x-ui

# 3. Запустить контейнер
docker compose up -d
```

Или вручную:

```bash
docker run -itd \
   -e XRAY_VMESS_AEAD_FORCED=false \
   -v $PWD/db/:/etc/x-ui/ \
   -v $PWD/cert/:/root/cert/ \
   --network=host \
   --restart=unless-stopped \
   --name 3x-ui \
   ghcr.io/mhsanaei/3x-ui:latest
```

> ⚠️ **При установке через Docker** данные по умолчанию: логин `admin`, пароль `admin`, порт `2053`. **Обязательно смените их сразу после первого входа!**

> 📌 Источник: [github.com/MHSanaei/3x-ui — Docker](https://github.com/MHSanaei/3x-ui/wiki)

### 2.3 Установка конкретной версии

```bash
VERSION=v2.8.11 && bash <(curl -Ls "https://raw.githubusercontent.com/mhsanaei/3x-ui/$VERSION/install.sh") $VERSION
```

---

## 3. Настройка SSL-сертификата для панели

> ⚠️ **Никогда не подключайтесь к панели по HTTP!** Данные передаются в открытом виде. Используйте HTTPS или SSH-туннель.

> 📌 Источник: [docs.edisglobal.com — Connect to the 3x-ui panel](https://docs.edisglobal.com/advanced-setup-guides/install-3x-ui-on-vps/install-3x-ui-on-ubuntu-2204)

### 3.1 Через ACME (встроенный механизм)

```bash
x-ui
```

Выберите в меню: **SSL Certificate Management** → укажите ваш домен.

### 3.2 Через Certbot (Let's Encrypt)

```bash
# Установить Certbot
apt install certbot -y

# Получить сертификат (замените domain.com на ваш домен)
certbot certonly --standalone -d domain.com

# Автообновление (добавить в cron)
echo "0 0 * * 1 certbot renew --quiet" | crontab -
```

### 3.3 Через Cloudflare

Если ваш домен управляется через Cloudflare:

```bash
x-ui
```

Выберите: **Cloudflare SSL Certificate** → введите:
- Имя домена
- Email аккаунта Cloudflare
- Global API Key

> 📌 Источник: [github.com/MHSanaei/3x-ui — SSL Certificate](https://github.com/MHSanaei/3x-ui)

---

## 4. Безопасность панели

По данным исследователей безопасности, наиболее частые уязвимости 3X-UI — **операционные, а не криптографические**:

- Пакеты системы не обновлены
- Firewall отсутствует или настроен разрешительно
- SSL-сертификат не настроен
- Панель открыта напрямую в интернет
- Учётные данные по умолчанию не сменены

> 📌 Источник: [elevenlabsmagazine.com — 3X-UI Deep Dive](https://elevenlabsmagazine.com/3x-ui-deep-dive-secure-xray-server-management/)

### 4.1 Смена учётных данных и порта

```bash
x-ui
```

В меню управления выберите:
- **6** — Сбросить логин/пароль
- **9** — Сменить порт панели
- **7** — Сбросить веб-путь (Web Base Path)

**Рекомендация:** Используйте длинный случайный путь, например:
```
https://domain.com:54321/xK9mP2vL8qR/panel
```

> 📌 Источник: [github.com/MHSanaei/3x-ui — Default Settings / Security Recommendation](https://github.com/MHSanaei/3x-ui)

### 4.2 Настройка firewall

#### Debian / Ubuntu (UFW)

```bash
# Установить UFW
apt install ufw -y

# Открыть SSH-порт (замените #порт на ваш)
ufw allow #порт/tcp

# Открыть порт панели (замените #порт)
ufw allow #порт_панели/tcp

# Открыть порт VPN-подключения (например, 443)
ufw allow 443/tcp

# Включить firewall
ufw enable

# Проверить
ufw status
```

#### CentOS / RHEL (firewalld)

```bash
firewall-cmd --add-port=#порт_ssh/tcp
firewall-cmd --add-port=#порт_панели/tcp
firewall-cmd --add-port=443/tcp
firewall-cmd --runtime-to-permanent
```

> ⚠️ **Порядок критичен:** сначала откройте нужные порты, потом включайте firewall. Иначе вы потеряете доступ.

### 4.3 Защита от подбора паролей (Fail2Ban)

```bash
# Установить
apt install fail2ban -y

# Создать локальную конфигурацию
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = #порт_ssh
filter = sshd
logpath = /var/log/auth.log
EOF

# Запустить
systemctl enable fail2ban
systemctl start fail2ban
```

### 4.4 Система обязательного доступа (MAC)

**CentOS / RHEL (SELinux):** при использовании нестандартного порта для VPN:

```bash
sestatus
yum install policycoreutils-python-utils
semanage port -a -t ssh_port_t -p tcp #порт
```

**Debian / Ubuntu (AppArmor):** по умолчанию не ограничивает привязку Xray к нестандартным портам — дополнительных действий не требуется.

### 4.5 Включение TCP BBR

Ускоряет сетевой трафик и снижает задержки:

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

Проверить:

```bash
sysctl net.ipv4.tcp_congestion_control
# Должно быть: net.ipv4.tcp_congestion_control = bbr
```

> 📌 Источник: [3x-ui.com — system requirements, BBR](https://3x-ui.com/what-are-3x-ui-system-requirements/)

### 4.6 Автообновление системы

```bash
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades
```

---

## 5. Настройка VPN-подключения (Inbound)

### 5.1 Рекомендуемая конфигурация: VLESS + Reality

**VLESS + Reality** — на данный момент самый стойкий к обнаружению и блокировке вариант. Трафик маскируется под обычное HTTPS-подключение к реальному сайту, не требуя собственного домена и SSL-сертификата для самого туннеля.

| Протокол | Стелс | Скорость | Сложность настройки | Требует домен |
|---|---|---|---|---|
| VLESS + Reality | ★★★★★ | ★★★★★ | Средняя | Нет |
| VLESS + WS + TLS | ★★★★ | ★★★ | Средняя | Да |
| VMess + WS + TLS | ★★★ | ★★★ | Средняя | Да |
| Trojan | ★★★★★ | ★★★★ | Средняя | Да |
| Shadowsocks | ★★ | ★★★★ | Простая | Нет |

> 📌 Источники: [vpn07.com — Protocol comparison 2026](https://vpn07.com/en/blog/2026-shadowrocket-protocols-vless-vmess-trojan-shadowsocks-comparison.html), [zhuquejiasu.com — Protocol comparison](https://www.zhuquejiasu.com/en/blog/v2ray-trojan-vless-vmess-protocol-comparison-pros-cons-and-use-cases), [grokipedia.com — VLESS](https://grokipedia.com/page/VLESS)

### 5.2 Пошаговая настройка VLESS + Reality

1. В панели перейдите **Inbounds** → **Add Inbound**
2. Заполните поля:

| Поле | Значение |
|---|---|
| Remark | Произвольное имя подключения |
| Protocol | `vless` |
| Port | `443` (или другой) |
| Transmission | `TCP (RAW)` |
| Security | `Reality` |

3. В секции **Reality**:
    - Нажмите **Get New Cert** — система автоматически сгенерирует пару ключей
    - **uTLS:** `chrome` или `firefox`
    - **SNI (Server Names):** укажите реально существующий сайт, например `dl.google.com`, `www.microsoft.com`, `www.apple.com`
    - **Dest:** тот же сайт с портом, например `dl.google.com:443`

4. В секции **Client**:
    - **Email:** уникальный идентификатор пользователя (обязательно для учёта трафика)
    - **Flow:** `xtls-rprx-vision` (для XTLS)

5. Нажмите **Create**

> 📌 Источник: [wiki.senko.digital — VLESS + Reality](https://wiki.senko.digital/vpn/3x-ui), [docs.edisglobal.com — VLESS setup](https://docs.edisglobal.com/advanced-setup-guides/install-3x-ui-on-vps/install-3x-ui-on-ubuntu-2204)

### 5.3 Настройка ограничений

Для каждого подключения (inbound) и каждого пользователя можно задать:

- **Лимит IP-адресов** — количество одновременных подключений с разных IP
- **Срок действия** — дата истечения (в днях)
- **Лимит трафика** — максимальный объём данных (в GB)

> 📌 Источник: [github.com/MHSanaei/3x-ui — Features](https://github.com/MHSanaei/3x-ui)

### 5.4 Альтернативные конфигурации

#### VMess + WebSocket + TLS

Требует домена и SSL-сертификата. Позволяет использовать CDN (Cloudflare) для скрытия IP сервера.

| Поле | Значение |
|---|---|
| Protocol | `vmess` |
| Port | `443` |
| Transmission | `ws` |
| Path | `/любой-путь` |
| Security | `tls` |
| Домен, сертификат | Указать в настройках TLS |

#### Trojan

Маскирует трафик под обычный HTTPS. Требует домен и валидный SSL-сертификат.

| Поле | Значение |
|---|---|
| Protocol | `trojan` |
| Port | `443` |
| Transmission | `tcp` |
| Security | `tls` |

---

## 6. Подключение клиентов

После создания inbound в панели можно получить ссылку/QR-код для клиента: нажмите иконку рядом с пользователем → скопируйте конфигурацию.

### 6.1 Клиенты по платформам

| Платформа | Клиент | Ссылка |
|---|---|---|
| **Windows** | v2rayN | [github.com/2dust/v2rayN](https://github.com/2dust/v2rayN) |
| **Windows** | Hiddify | [github.com/hiddify/hiddify-app](https://github.com/hiddify/hiddify-app) |
| **Windows** | NekoRay | [github.com/MatsuriDayo/nekoray](https://github.com/MatsuriDayo/nekoray) |
| **macOS** | FoXray | [github.com/FoXray](https://github.com/FoXray-com/FoXray) |
| **macOS** | V2rayU | [github.com/yanue/V2rayU](https://github.com/yanue/V2rayU) |
| **macOS** | Hiddify | [github.com/hiddify/hiddify-app](https://github.com/hiddify/hiddify-app) |
| **Linux** | Hiddify | [github.com/hiddify/hiddify-app](https://github.com/hiddify/hiddify-app) |
| **Linux** | NekoRay | [github.com/MatsuriDayo/nekoray](https://github.com/MatsuriDayo/nekoray) |
| **Linux** | v2rayA | [github.com/v2rayA/v2rayA](https://github.com/v2rayA/v2rayA) |
| **Android** | v2rayNG | [github.com/2dust/v2rayNG](https://github.com/2dust/v2rayNG) |
| **Android** | Hiddify | [github.com/hiddify/hiddify-app](https://github.com/hiddify/hiddify-app) |
| **iOS** | Streisand | App Store |
| **iOS** | FoXray | App Store |
| **iOS** | Shadowrocket | App Store (платный) |

> 📌 Источник: [github.com/XTLS/Xray-core — GUI Clients](https://github.com/XTLS/Xray-core), [hostkey.com — 3X-UI documentation](https://hostkey.com/documentation/marketplace/security/3x_ui)

### 6.2 Подключение (общий алгоритм)

1. В панели 3X-UI: **Inbounds** → нажмите иконку QR-кода/ссылки рядом с пользователем
2. Скопируйте конфигурацию (ссылка `vless://...`) или QR-код
3. В клиенте: **Импорт из буфера обмена** или **сканирование QR-кода**
4. Активируйте подключение

---

## 7. Управление панелью

### 7.1 Меню управления

Вызывается командой:

```bash
x-ui
```

| № | Действие |
|---|---|
| 0 | Выход |
| 1 | Установить |
| 2 | Обновить |
| 6 | Сбросить логин/пароль |
| 7 | Сбросить Web Base Path |
| 8 | Сбросить все настройки |
| 9 | Сменить порт панели |
| 10 | Просмотреть текущие настройки |
| 11 | Запустить |
| 12 | Остановить |
| 13 | Перезапустить |
| 14 | Статус |
| 15 | Автозапуск |
| 18 | Управление SSL-сертификатами |
| 19 | SSL через Cloudflare |
| 20 | Управление IP-лимитами |
| 21 | Управление firewall |
| 22 | Включить BBR |
| 23 | Обновить Geo-файлы |

> 📌 Источник: [lahello.com — 3x-ui management menu](https://lahello.com/archives/3x-ui-installation-tutorial-and-node-management-user-guide)

### 7.2 Просмотр текущих настроек

```bash
x-ui settings
```

Или через меню: пункт **10**.

### 7.3 Резервное копирование

- **База данных:** `/etc/x-ui/x-ui.db`
- **Конфигурация Xray:** `/usr/local/x-ui/bin/config.json`

В панели: **Panel Settings** → **Export Database** / **Import Database**

**Рекомендуется:** еженедельный бэкup на внешний носитель.

---

## 8. Обновление

### 8.1 Стандартное обновление

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

Или через меню:

```bash
x-ui
# Выбрать пункт 2 — Update
```

### 8.2 Через Docker

```bash
cd 3x-ui
docker compose down
docker compose pull 3x-ui
docker compose up -d
```

> 📌 Источник: [github.com/MHSanaei/3x-ui — Install & Upgrade](https://github.com/MHSanaei/3x-ui), [wiki.senko.digital — Updating](https://wiki.senko.digital/vpn/3x-ui)

---

## 9. Удаление

```bash
# Остановить и отключить сервис
systemctl stop x-ui
systemctl disable x-ui

# Удалить файлы
rm -rf /usr/local/x-ui/
rm -rf /usr/bin/x-ui
rm -f /etc/systemd/system/x-ui.service

# Перечитать systemd
systemctl daemon-reload
```

> 📌 Источник: [lahello.com — Uninstalling](https://lahello.com/archives/3x-ui-installation-tutorial-and-node-management-user-guide)

---

## 10. Чек-лист безопасности

Пункт | Статус
---|---
SSH: вход только по ключу, пароль отключён | ☐
SSH: вход по root запрещён | ☐
SSH: нестандартный порт | ☐
3X-UI: логин/пароль сменены с дефолтных | ☐
3X-UI: нестандартный порт панели (41000–65000) | ☐
3X-UI: длинный случайный Web Base Path | ☐
3X-UI: доступ только по HTTPS | ☐
Firewall: открыты только нужные порты | ☐
Fail2Ban: установлен и настроен | ☐
BBR: включён | ☐
Система: автообновление безопасности | ☐
Бэкапы: настроены еженедельно | ☐
Xray-core и 3X-UI: обновлены до последних версий | ☐
VPN-протокол: VLESS + Reality (рекомендуется) | ☐

---

## Ссылки на источники

1. **Официальный репозиторий 3X-UI:** [github.com/MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui)
2. **Официальная Wiki 3X-UI:** [github.com/MHSanaei/3x-ui/wiki](https://github.com/MHSanaei/3x-ui/wiki)
3. **Официальный сайт Xray-core:** [github.com/XTLS/Xray-core](https://github.com/XTLS/Xray-core) — список GUI-клиентов
4. **Senko Digital Wiki — инструкция:** [wiki.senko.digital/vpn/3x-ui](https://wiki.senko.digital/vpn/3x-ui)
5. **EDIS Global Docs — установка на Ubuntu:** [docs.edisglobal.com](https://docs.edisglobal.com/advanced-setup-guides/install-3x-ui-on-vps/install-3x-ui-on-ubuntu-2204)
6. **is*hosting — руководство:** [blog.ishosting.com/en/3x-ui-vpn-guide](https://blog.ishosting.com/en/3x-ui-vpn-guide)
7. **3X-UI System Requirements:** [3x-ui.com/system-requirements](https://3x-ui.com/what-are-3x-ui-system-requirements/)
8. **3X-UI Deep Dive — Security:** [elevenlabsmagazine.com](https://elevenlabsmagazine.com/3x-ui-deep-dive-secure-xray-server-management/)
9. **HOTKEY — документация и клиенты:** [hostkey.com/documentation/marketplace/security/3x_ui](https://hostkey.com/documentation/marketplace/security/3x_ui)
10. **Сравнение протоколов 2026:** [vpn07.com](https://vpn07.com/en/blog/2026-shadowrocket-protocols-vless-vmess-trojan-shadowsocks-comparison.html)
11. **VLESS vs VMess vs Trojan:** [zhuquejiasu.com](https://www.zhuquejiasu.com/en/blog/v2ray-trojan-vless-vmess-protocol-comparison-pros-cons-and-use-cases)
12. **VLESS — Wikipedia:** [grokipedia.com/page/VLESS](https://grokipedia.com/page/VLESS)
13. **Docker + VLESS-REALITY:** [semenov.work](https://semenov.work/posts/3x-ui-vless-reality-vpn/)