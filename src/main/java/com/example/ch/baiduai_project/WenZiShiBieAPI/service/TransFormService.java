package com.example.ch.baiduai_project.WenZiShiBieAPI.service;


import com.example.ch.baiduai_project.WenZiShiBieAPI.apiUtil.Base64Util;
import com.example.ch.baiduai_project.WenZiShiBieAPI.apiUtil.HttpUtil;
import com.example.ch.baiduai_project.WenZiShiBieAPI.setting.CharacterSetting;
import com.example.ch.baiduai_project.WenZiShiBieAPI.setting.ParamSetting;
import com.example.ch.baiduai_project.util.RequestUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransFormService {

    @Autowired
    private CharacterSetting setting;

    private final org.slf4j.Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * 图像转换的核心方法
     * @return
     */
    public List<String> transform( byte[] imgData) {
        String imgStr = Base64Util.encode(imgData);
        String params = null;
        ArrayList<String> resultArr = new ArrayList();
        try {
            params = URLEncoder.encode("image", "UTF-8") + "=" + URLEncoder.encode(imgStr, "UTF-8");
            /**
             * 线上环境access_token有过期时间， 客户端可自行缓存，过期后重新获取。
             */
            String accessToken = new ParamSetting().getAccessToken().toString();
            ObjectMapper mapper = new ObjectMapper();
            logger.info("api访问中...");
            JsonNode node = mapper.readTree(HttpUtil.post(setting.getUrl(), accessToken, params));


            logger.info(params);
            logger.info(node.textValue());

            //如果访问接口出错
            if (node.get("error_code")!=null) {
                if (node.get("error_code").asInt() == 110) {
                    updateToken();
                    accessToken = new ParamSetting().getAccessToken().toString();
                    node = mapper.readTree(HttpUtil.post(setting.getUrl(), accessToken, params));
                }else{
                    resultArr.add(node.get("error_code").textValue());
                }
            }else{
                //返回结果
                for (JsonNode result : node.get("words_result")) {
                    resultArr.add(result.get("words").textValue());
                }
                logger.info(resultArr.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            resultArr.add("服务器内部出现错误");
        }
        return resultArr;
    }

    private String getTonekUrl = "https://aip.baidubce.com/oauth/2.0/token";
    public void updateToken() {
        Map<String, Object> params = new HashMap<>();
        params.put("grant_type", "client_credentials");
        params.put("client_id", setting.getKey());
        params.put("client_secret", setting.getSecret());
        JsonNode jsonNode = RequestUtil.ResponseEntityFormat4JSON(RequestUtil.getRequest(getTonekUrl, params).getBody());
        new ParamSetting().setAccessToken(jsonNode.get("access_token").textValue());
    }
}
