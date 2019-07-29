package com.example.ch.baiduai_project.util.myUtil;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;

/**
 * Created by xiaoq on 2017-06-13.
 */
public class Utils {

    /**
     * 取客户端的真实IP地址，支持代理
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    public static String getClientRealIP(HttpServletRequest request) throws UnsupportedEncodingException {


        String realIP = request.getHeader("x-forwarded-for");
        if (realIP != null && realIP.length() != 0) {
            while ((realIP != null) && (realIP.equals("unknown"))) {
                realIP = request.getHeader("x-forwarded-for");
            }
        }
        if (realIP == null || realIP.length() == 0) {
            realIP = request.getHeader("Proxy-Client-IP");
        }
        if (realIP == null || realIP.length() == 0) {
            realIP = request.getHeader("WL-Proxy-Client-IP");
        }
        if (realIP == null || realIP.length() == 0) {
            realIP = request.getRemoteAddr();
        }

        return realIP;
    }
}
