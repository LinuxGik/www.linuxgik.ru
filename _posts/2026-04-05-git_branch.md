---
title: Ветки Git
---

## 1 Просмотр веток

Для того чтобы просмотреть текущую ветку в Git, можно использовать несколько команд в зависимости от того, какой объем информации вам нужен.
### 1.1 Основные команды

* <code style="backround-color: grey;">git branch --show-current</code> : Самый прямой способ. Команда выводит только имя текущей ветки и ничего лишнего.
* git branch: Выводит список всех локальных веток. Текущая ветка будет выделена цветом и отмечена символом звездочки (*).
* git status: Помимо списка измененных файлов, в самой первой строке вывода всегда указывается название текущей ветки (например, On branch master). [1, 2, 3, 4]

### 1.2 Дополнительные варианты

* Для получения подробной информации:
* git branch -v: Покажет текущую ветку вместе с последним коммитом в каждой из них.
    * git branch -vv: Полезно, если нужно увидеть, какую удаленную ветку отслеживает ваша локальная ветка.
* Для скриптов и автоматизации:
* git rev-parse --abbrev-ref HEAD: Часто используется в скриптах для быстрого получения имени ветки. [1, 5, 6, 7]

Совет: Если вы часто работаете с ветками, удобно настроить отображение текущей ветки прямо в строке приглашения терминала (prompt) с помощью специальных утилит вроде Starship или правок в .bashrc/.zshrc. [2]
Хотите узнать, как переключиться на другую ветку или создать новую?

[1] [https://www.reddit.com](https://www.reddit.com/r/git/comments/kifb5z/how_to_determine_the_current_branch/?tl=ru)
[2] [https://zzet.org](https://zzet.org/ru/git/tekushchaya-vetka-git/)
[3] [https://pingvinus.ru](https://pingvinus.ru/git/1568)
[4] [https://habr.com](https://habr.com/ru/articles/905658/)
[5] [https://webhamster.ru](https://webhamster.ru/mytetrashare/index/mtb145/14814877839imximuvsg)
[6] [https://git-scm.com](https://git-scm.com/book/ru/v2/%D0%92%D0%B5%D1%82%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2-Git-%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%D0%BC%D0%B8)
[7] [https://git-scm.com](https://git-scm.com/book/ru/v2/%D0%92%D0%B5%D1%82%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2-Git-%D0%A3%D0%B4%D0%B0%D0%BB%D1%91%D0%BD%D0%BD%D1%8B%D0%B5-%D0%B2%D0%B5%D1%82%D0%BA%D0%B8#:~:text=%D0%95%D1%81%D0%BB%D0%B8%20%D0%B2%D1%8B%20%D1%85%D0%BE%D1%82%D0%B8%D1%82%D0%B5%20%D0%BF%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C%20%D0%BA%D0%B0%D0%BA%20%D1%83%20%D0%B2%D0%B0%D1%81,%D0%BE%D1%82%D1%81%D1%82%D0%B0%D1%91%D1%82%2C%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B6%D0%B0%D0%B5%D1%82%20%D0%B8%D0%BB%D0%B8%20%D0%B2%D1%81%D1%91%20%D1%81%D1%80%D0%B0%D0%B7%D1%83%20%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BE%D1%82%D1%81%D0%BB%D0%B5%D0%B6%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%D0%BE%D0%B9.)
