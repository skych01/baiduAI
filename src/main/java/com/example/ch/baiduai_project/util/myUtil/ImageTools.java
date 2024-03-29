package com.example.ch.baiduai_project.util.myUtil;


import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Date;


public class ImageTools {

    /**
     * 获取图片宽度
     * @param fileInputStream  图片流
     * @return 宽度
     */
    public static int getImgWidth(InputStream fileInputStream) {
        InputStream is = fileInputStream;
        BufferedImage src = null;
        int ret = -1;
        try {
            src = javax.imageio.ImageIO.read(is);
            ret = src.getWidth(null); // 得到源图宽
            is.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }


    /**
     * 获取图片高度
     * @param fileInputStream  图片流
     * @return 高度
     */
    public static int getImgHeight(InputStream fileInputStream) {
        InputStream is = fileInputStream;
        BufferedImage src = null;
        int ret = -1;
        try {
            src = javax.imageio.ImageIO.read(is);
            ret = src.getHeight(null); // 得到源图高
            is.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    public static String getAppPath(HttpServletRequest request) {
        String path = request.getServletContext().getRealPath("/");
        if (path.endsWith("/")) {
            return path;
        } else {
            return path + "/";
        }
    }

    public static String getDomain(HttpServletRequest request) {
        StringBuffer url = request.getRequestURL();
        String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length()).append("/").toString();
        return tempContextUrl;
    }

    public static   String getDomainNotPath(HttpServletRequest request) {
        StringBuffer url = request.getRequestURL();
        String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length()).toString();
        return tempContextUrl;
    }



    /**
     * 判断是否是图片
     *
     * @param name
     * @return
     */


    public static  boolean isPicture(String name) {
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif");
    }


    /**
     * 将数据写到某文件下
     *
     * @param filedata
     * @param file
     * @throws IOException
     */

    public  static void writeTo(byte[] filedata, File file) throws IOException {
        FileOutputStream fos = new FileOutputStream(file);
        try {
            fos.write(filedata);
        } finally {
            fos.close();
        }
    }

    /**
     * 根据文件信息 存放文件，返回访问该文件的url
     *
     * @param fileName
     * @param uploadTime
     * @param b
     * @param request
     * @return
     * @throws IOException
     */


    public  static String dispatchInfoImg(String id, String fileName, String serviceType, Date uploadTime, byte[] b, String domain,
                                         HttpServletRequest request) throws IOException {
        String filePath = "";
        StringBuilder sb = new StringBuilder();
        sb.append(getAppPath(request));
        sb.append("temp/");
        sb.append(serviceType + "/");
        sb.append(id + "/");
        String path = sb.toString();
        File file = new File(path);
        if (!file.exists()) file.mkdirs();
        fileName = id + "_" + uploadTime.getTime() + fileName;
        file = new File(path + fileName);
        if (file.exists()) {
            if (uploadTime.getTime() > file.lastModified()) {
                file.delete();
                writeTo(b, file);
            }
        } else {
            if (b != null) {
                writeTo(b, file);
            }
        }
        if (file.exists()) {
            fileName = URLEncoder.encode(fileName, "utf-8");
            filePath = getDomainNotPath(request) + domain+ "/temp/" + serviceType + "/" + id + "/" + fileName;
        }
        return filePath;
    }

    public  static String dispatchInfoImg(int id, String fileName, String serviceType, Date uploadTime, byte[] b,String domain,
                                         HttpServletRequest request) throws IOException {
       return dispatchInfoImg(id + "", fileName, serviceType, uploadTime, b,domain, request);
    }
}
