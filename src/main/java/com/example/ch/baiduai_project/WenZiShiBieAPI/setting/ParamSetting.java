package com.example.ch.baiduai_project.WenZiShiBieAPI.setting;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class ParamSetting {


    private Properties pro = new Properties();

    private String accessToken = "access_token";
    private String settingPath = "src/main/resources/param.properties";

    public Object getAccessToken() throws IOException {
        FileInputStream in = new FileInputStream(settingPath);
        pro.load(in);
        in.close();
        return pro.get(accessToken);
    }

    public void setAccessToken(String token) {
        FileOutputStream oFile = null;//true表示追加打开
        try {
            oFile = new FileOutputStream(settingPath, false);
            pro.setProperty(accessToken, token);
            pro.store(oFile, "update token...");
            oFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
