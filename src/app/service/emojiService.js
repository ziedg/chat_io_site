System.register(['@angular/core', "../beans/emoji-list-bean", "../beans/emoji-bean"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, emoji_list_bean_1, emoji_bean_1;
    var EmojiService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (emoji_list_bean_1_1) {
                emoji_list_bean_1 = emoji_list_bean_1_1;
            },
            function (emoji_bean_1_1) {
                emoji_bean_1 = emoji_bean_1_1;
            }],
        execute: function() {
            /* beans */
            EmojiService = (function () {
                /* constructor  */
                function EmojiService() {
                    this.listEmoji = [];
                    var nvList = new emoji_list_bean_1.EmojiListBean();
                    var nvemoji = new emoji_bean_1.EmojiBean();
                    // list people
                    nvList.title = "persone";
                    nvList.list = [];
                    nvemoji = new emoji_bean_1.EmojiBean();
                    nvList.list.push(this.addtoListEmoji(":)", "blush"));
                    nvList.list.push(this.addtoListEmoji(":D", "smile"));
                    nvList.list.push(this.addtoListEmoji(";)", "smirk"));
                    nvList.list.push(this.addtoListEmoji("&lt;3_&lt;3", "stuck_out_tongue"));
                    nvList.list.push(this.addtoListEmoji(":*", "kissing"));
                    nvList.list.push(this.addtoListEmoji(":p", "stuck_out_tongue"));
                    nvList.list.push(this.addtoListEmoji("&rt;:D", "laughing"));
                    nvList.list.push(this.addtoListEmoji(":o", "open_mouth"));
                    nvList.list.push(this.addtoListEmoji(":/", "confused"));
                    nvList.list.push(this.addtoListEmoji("-_-", "expressionless"));
                    nvList.list.push(this.addtoListEmoji(":(", "disappointed"));
                    nvList.list.push(this.addtoListEmoji("&rt;_&lt;", "persevere"));
                    nvList.list.push(this.addtoListEmoji(":'(", "cry"));
                    nvList.list.push(this.addtoListEmoji(":)p", "yum"));
                    nvList.list.push(this.addtoListEmoji("&lt;3", "heart"));
                    nvList.list.push(this.addtoListEmoji("B)", "sunglasses"));
                    nvList.list.push(this.addtoListEmoji("O:)", "innocent"));
                    nvList.list.push(this.addtoListEmoji("3:)", "smiling_imp"));
                    nvList.list.push(this.addtoListEmoji("(y)", "thumbsup"));
                    nvList.list.push(this.addtoListEmoji(":dislike:", "-1"));
                    nvList.list.push(this.addtoListEmoji(":punch:", "punch"));
                    nvList.list.push(this.addtoListEmoji(":v:", "v"));
                    nvList.list.push(this.addtoListEmoji(":clap:", "clap"));
                    nvList.list.push(this.addtoListEmoji(":kiss:", "kiss"));
                    nvList.list.push(this.addtoListEmoji(":tongue:", "tongue"));
                    nvList.list.push(this.addtoListEmoji(":thought_balloon:", "thought_balloon"));
                    nvList.list.push(this.addtoListEmoji(":trollface:", "trollface"));
                    this.listEmoji[0] = nvList;
                    // nature
                    nvList = new emoji_list_bean_1.EmojiListBean();
                    nvList.list = [];
                    nvList.title = "nature";
                    nvList.list.push(this.addtoListEmoji(":sunny:", "sunny"));
                    nvList.list.push(this.addtoListEmoji(":umbrella:", "umbrella"));
                    nvList.list.push(this.addtoListEmoji(":cloud:", "cloud"));
                    nvList.list.push(this.addtoListEmoji(":snowman:", "snowman"));
                    nvList.list.push(this.addtoListEmoji(":zap:", "zap"));
                    nvList.list.push(this.addtoListEmoji(":cyclone:", "cyclone"));
                    nvList.list.push(this.addtoListEmoji(":cherry_blossom:", "cherry_blossom"));
                    nvList.list.push(this.addtoListEmoji(":rose:", "rose"));
                    nvList.list.push(this.addtoListEmoji(":tulip:", "tulip"));
                    nvList.list.push(this.addtoListEmoji(":sunflower:", "sunflower"));
                    nvList.list.push(this.addtoListEmoji(":deciduous_tree:", "deciduous_tree"));
                    nvList.list.push(this.addtoListEmoji(":evergreen_tree:", "evergreen_tree"));
                    nvList.list.push(this.addtoListEmoji(":sun_with_face:", "sun_with_face"));
                    nvList.list.push(this.addtoListEmoji(":cat:", "cat"));
                    nvList.list.push(this.addtoListEmoji(":dog:", "dog"));
                    nvList.list.push(this.addtoListEmoji(":monkey_face:", "monkey_face"));
                    nvList.list.push(this.addtoListEmoji(":horse:", "horse"));
                    nvList.list.push(this.addtoListEmoji(":camel:", "camel"));
                    nvList.list.push(this.addtoListEmoji(":ram:", "ram"));
                    nvList.list.push(this.addtoListEmoji(":honeybee:", "honeybee"));
                    nvList.list.push(this.addtoListEmoji(":snake:", "snake"));
                    nvList.list.push(this.addtoListEmoji(":ox:", "ox"));
                    nvList.list.push(this.addtoListEmoji(":dragon:", "dragon"));
                    nvList.list.push(this.addtoListEmoji(":whale:", "whale"));
                    nvList.list.push(this.addtoListEmoji(":fish:", "fish"));
                    nvList.list.push(this.addtoListEmoji(":turtle:", "turtle"));
                    nvList.list.push(this.addtoListEmoji(":beetle:", "beetle"));
                    nvList.list.push(this.addtoListEmoji(":leopard:", "leopard"));
                    nvList.list.push(this.addtoListEmoji(":pig2:", "pig2"));
                    nvList.list.push(this.addtoListEmoji(":mouse2:", "mouse2"));
                    this.listEmoji[1] = nvList;
                    // nature
                    nvList = new emoji_list_bean_1.EmojiListBean();
                    nvList.list = [];
                    nvList.title = "objets";
                    nvList.list.push(this.addtoListEmoji(":gift_heart:", "gift_heart"));
                    nvList.list.push(this.addtoListEmoji(":school_satchel:", "school_satchel"));
                    nvList.list.push(this.addtoListEmoji(":flags:", "flags"));
                    nvList.list.push(this.addtoListEmoji(":fireworks:", "fireworks"));
                    nvList.list.push(this.addtoListEmoji(":jack_o_lantern:", "jack_o_lantern"));
                    nvList.list.push(this.addtoListEmoji(":jack_o_lantern:", "jack_o_lantern"));
                    nvList.list.push(this.addtoListEmoji(":clap:", "clap"));
                    nvList.list.push(this.addtoListEmoji(":fireworks:", "fireworks"));
                    nvList.list.push(this.addtoListEmoji(":bell:", "bell"));
                    nvList.list.push(this.addtoListEmoji(":iphone:", "iphone"));
                    nvList.list.push(this.addtoListEmoji(":phone:", "phone"));
                    nvList.list.push(this.addtoListEmoji(":tv:", "tv"));
                    nvList.list.push(this.addtoListEmoji(":computer:", "computer"));
                    nvList.list.push(this.addtoListEmoji(":tv:", "tv"));
                    nvList.list.push(this.addtoListEmoji(":computer:", "computer"));
                    nvList.list.push(this.addtoListEmoji(":fax:", "fax"));
                    nvList.list.push(this.addtoListEmoji(":watch:", "watch"));
                    nvList.list.push(this.addtoListEmoji(":alarm_clock:", "alarm_clock"));
                    nvList.list.push(this.addtoListEmoji(":mag_right:", "mag_right"));
                    nvList.list.push(this.addtoListEmoji(":lock:", "lock"));
                    nvList.list.push(this.addtoListEmoji(":unlock:", "unlock"));
                    nvList.list.push(this.addtoListEmoji(":key:", "key"));
                    nvList.list.push(this.addtoListEmoji(":toilet:", "toilet"));
                    nvList.list.push(this.addtoListEmoji(":bomb:", "bomb"));
                    nvList.list.push(this.addtoListEmoji(":closed_book:", "closed_book"));
                    nvList.list.push(this.addtoListEmoji(":soccer:", "soccer"));
                    nvList.list.push(this.addtoListEmoji(":tennis:", "tennis"));
                    nvList.list.push(this.addtoListEmoji(":rugby_football:", "rugby_football"));
                    nvList.list.push(this.addtoListEmoji(":ring:", "ring"));
                    nvList.list.push(this.addtoListEmoji(":lipstick:", "lipstick"));
                    this.listEmoji[2] = nvList;
                }
                EmojiService.prototype.addtoListEmoji = function (shortcut, imageName) {
                    var nvemoji = new emoji_bean_1.EmojiBean();
                    nvemoji.shortcut = shortcut;
                    nvemoji.imageName = imageName;
                    return nvemoji;
                };
                EmojiService.prototype.getEmojiList = function () {
                    return this.listEmoji;
                };
                EmojiService.prototype.AfficheWithEmoji = function (text) {
                    if (this.isAEmoji(this.replaceAll(text, " ", ""))) {
                        var img = '<img class="emoji-img"  src="assets/images/basic/';
                    }
                    else {
                        var img = '<img class="emoji-img emoji" src="assets/images/basic/';
                    }
                    var newText = "";
                    var textSplicedInLine = text.split("\n");
                    for (var i = 0; i < textSplicedInLine.length; i++) {
                        var textSplicedInOneLine = textSplicedInLine[i].split(" ");
                        for (var j = 0; j < textSplicedInOneLine.length; j++) {
                            var textAfterEdit = textSplicedInOneLine[j];
                            textAfterEdit = this.replaceAll(textAfterEdit, "&nbsp;", " ");
                            for (var i = 0; i < textAfterEdit.length; i++) {
                                if (textAfterEdit.charCodeAt(i) == 160) {
                                    textAfterEdit = textAfterEdit.replace(textAfterEdit[i], "");
                                }
                            }
                            if (this.isAEmoji(this.replaceAll(textAfterEdit, " ", ""))) {
                                newText = newText + ' ' + img + this.shortCutToImageName(this.replaceAll(textAfterEdit, " ", "")) + '.png" /> ';
                            }
                            else {
                                newText = newText + " " + textSplicedInOneLine[j];
                            }
                        }
                        newText = newText + " <br> ";
                    }
                    return newText;
                };
                EmojiService.prototype.replaceAll = function (comment, search, replacement) {
                    return comment.split(search).join(replacement);
                };
                EmojiService.prototype.isAEmoji = function (text) {
                    for (var i = 0; i < this.listEmoji.length; i++) {
                        for (var j = 0; j < this.listEmoji[i].list.length; j++) {
                            if (text == this.listEmoji[i].list[j].shortcut) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                EmojiService.prototype.shortCutToImageName = function (short) {
                    for (var i = 0; i < this.listEmoji.length; i++) {
                        for (var j = 0; j < this.listEmoji[i].list.length; j++) {
                            if (short === this.listEmoji[i].list[j].shortcut)
                                return this.listEmoji[i].list[j].imageName;
                        }
                    }
                    return "";
                };
                EmojiService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], EmojiService);
                return EmojiService;
            }());
            exports_1("EmojiService", EmojiService);
        }
    }
});
//# sourceMappingURL=emojiService.js.map