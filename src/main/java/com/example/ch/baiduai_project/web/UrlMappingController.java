package com.example.ch.baiduai_project.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UrlMappingController {

    @RequestMapping("/*")
    public String index() {
        return "login";
    }


}
