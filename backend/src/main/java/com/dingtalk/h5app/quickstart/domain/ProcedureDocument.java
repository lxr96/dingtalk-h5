package com.dingtalk.h5app.quickstart.domain;

/** 
* @ClassName: ProcedureDocument 
* @Description: 程序文件 实体
* @author lxr 
* @date 2020年4月24日 下午12:06:17 
*  
*/
public class ProcedureDocument {
	
	private String documentCode;
	private String versionState;
	private String version;
	private String versionDate;
	public String getDocumentCode() {
		return documentCode;
	}
	public void setDocumentCode(String documentCode) {
		this.documentCode = documentCode;
	}
	public String getVersionState() {
		return versionState;
	}
	public void setVersionState(String versionState) {
		this.versionState = versionState;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getVersionDate() {
		return versionDate;
	}
	public void setVersionDate(String versionDate) {
		this.versionDate = versionDate;
	}
	@Override
	public String toString() {
		return "ProcedureDocument [documentCode=" + documentCode + ", versionState=" + versionState + ", version="
				+ version + ", versionDate=" + versionDate + "]";
	}
	

}
