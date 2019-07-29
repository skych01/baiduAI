package com.example.ch.baiduai_project;

import com.example.ch.baiduai_project.WenZiShiBieAPI.apiUtil.Base64Util;
import com.example.ch.baiduai_project.WenZiShiBieAPI.apiUtil.FileUtil;
import com.example.ch.baiduai_project.WenZiShiBieAPI.apiUtil.HttpUtil;
import com.example.ch.baiduai_project.WenZiShiBieAPI.service.TransFormService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BaiduaiProjectApplicationTests {

    @Autowired
    private TransFormService transFormService;

    @Test
    public void contextLoads() {
        transFormService.updateToken();

    }

    public static void main(String[] args) {
        // 通用识别url
        String otherHost = "https://aip.baidubce.com/rest/2.0/ocr/v1/general";
        // 本地图片路径
        String filePath = "C:\\Users\\Administrator\\Desktop\\微信截图_20190729102859.jpg";
        try {
            byte[] imgData = FileUtil.readFileByBytes(filePath);
            String imgStr = Base64Util.encode(imgData);
            String params = URLEncoder.encode("image", "UTF-8") + "=" + URLEncoder.encode(imgStr, "UTF-8");
            System.out.println(params);
            /**
             * 线上环境access_token有过期时间， 客户端可自行缓存，过期后重新获取。
             */
            String accessToken = "24.9fa9c788d43da6422f067df6bef38f49.2592000.1560310834.282335-16235078";
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(HttpUtil.post(otherHost, accessToken, params));
            System.out.println(node);

            ArrayList<String> resultArr = new ArrayList();

            for (JsonNode result : node.get("words_result")) {
                resultArr.add(result.get("words").textValue());
            }

            System.out.println(resultArr);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private byte[] steam2Byte(OutputStream steam) {
        return null;
    }
}
