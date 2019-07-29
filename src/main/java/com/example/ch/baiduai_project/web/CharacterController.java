package com.example.ch.baiduai_project.web;

import com.example.ch.baiduai_project.WenZiShiBieAPI.service.TransFormService;
import com.example.ch.baiduai_project.WenZiShiBieAPI.setting.ParamSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class CharacterController {

    @Autowired
    private TransFormService transFormService;



    @RequestMapping("/trans")
    public List trans(@RequestParam(value = "fileupload") MultipartFile fileupload) {
        try {
         return transFormService.transform(fileupload.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Value("${server.port}")
    String port;

    @RequestMapping("/test1")
    @ResponseBody
    public Object test1(String name) throws IOException {
        //paramSetting.setAccessToken(name);
        return new ParamSetting().getAccessToken();
    }

    @RequestMapping("/test2")
    @ResponseBody
    public String test2(String name) throws IOException {
        //paramSetting.setAccessToken(name);
         new ParamSetting().setAccessToken(name);
        return "成功";
    }


}
