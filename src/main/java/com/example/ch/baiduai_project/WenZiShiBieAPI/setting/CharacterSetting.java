package com.example.ch.baiduai_project.WenZiShiBieAPI.setting;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "my.character")
public class CharacterSetting {
    private String url;
    private String key;
    private String secret;

//    private String token;
//public String getToken() {
//    return token;
//}
//
//    public void setToken(String token) {
//        this.token = token;
//}

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }



}
