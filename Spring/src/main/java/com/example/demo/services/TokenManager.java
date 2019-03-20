package com.example.demo.services;

import java.io.BufferedReader;
import java.io.OutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;



public class TokenManager {
	
	private String token;

	public TokenManager() {
		super();
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public void generateToken(String serviceName ) throws IOException {
		
		// Body content
		final String POST_PARAMS = "{\n" + 
		        "    \"nombre\": \"cs-javedent\",\r\n" +
		        "    \"password\": \"TNV1ZElu\"" + "\n}";
		// Service URL
	    URL obj = new URL("http://apitst.javeriana.edu.co/api/v1/seguridad/token");
	    HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
	    postConnection.setRequestMethod("POST");
	    //Headers
	    postConnection.setRequestProperty("Content-Type", "application/json");
	    postConnection.setRequestProperty("Cache-Control", "no-cache");
	    postConnection.setRequestProperty("servicio", serviceName);
	    postConnection.setDoOutput(true);
	    OutputStream os = postConnection.getOutputStream();
	    os.write(POST_PARAMS.getBytes());
	    os.flush();
	    os.close();
	    int responseCode = postConnection.getResponseCode();
	    System.out.println("POST Response Code :  " + responseCode);
	    // If responseCode == 200
	    if (responseCode == HttpURLConnection.HTTP_OK) { //success
	        BufferedReader in = new BufferedReader(new InputStreamReader(
	            postConnection.getInputStream()));
	        String inputLine;
	        StringBuffer response = new StringBuffer();
	        while ((inputLine = in .readLine()) != null) {
	            response.append(inputLine);
	        } in .close();
	        // Set result to the class
	        this.token = response.toString();
	    } else {
	        System.out.println("POST NOT WORKED");
	    }

 }
}
