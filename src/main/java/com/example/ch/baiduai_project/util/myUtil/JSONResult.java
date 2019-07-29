package com.example.ch.baiduai_project.util.myUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by xiaoq on 2017-06-16.
 */
public class JSONResult {
    private boolean success;
    private String message;
    private Object content;

    public JSONResult(){}

    public JSONResult(boolean success, String message, Object content) {
        this.setSuccess(success);
        this.setMessage(message);
        this.setContent(content);
    }

    public static JSONResult success(Object content) {
        return new JSONResult(Boolean.TRUE, null, content);
    }

    public static JSONResult success() {
        return success(null);
    }

    public static JSONResult fail(String message) {
        return new JSONResult(Boolean.FALSE, message, null);
    }
    public static JSONResult fail() {
        return new JSONResult(Boolean.FALSE, null, null);
    }
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    @Override
    public String toString() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
}
