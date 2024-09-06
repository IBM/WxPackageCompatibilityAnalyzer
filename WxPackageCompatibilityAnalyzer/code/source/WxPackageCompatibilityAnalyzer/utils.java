package WxPackageCompatibilityAnalyzer;

// -----( IS Java Code Template v1.2

import com.wm.data.*;
import com.wm.util.Values;
import com.wm.app.b2b.server.Service;
import com.wm.app.b2b.server.ServiceException;
// --- <<IS-START-IMPORTS>> ---
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
// --- <<IS-END-IMPORTS>> ---

public final class utils

{
	// ---( internal utility methods )---

	final static utils _instance = new utils();

	static utils _newInstance() { return new utils(); }

	static utils _cast(Object o) { return (utils)o; }

	// ---( server methods )---




	public static final void checkObjectType (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(checkObjectType)>> ---
		// @sigtype java 3.5
		// [i] object:0:required inObject
		// [o] field:0:required isObjectString
		IDataCursor idc = pipeline.getCursor();
		Object	inObject = IDataUtil.get( idc, "inObject" );
		boolean isObjectString = false;
		if (inObject instanceof String) {
			isObjectString = true ;
		}
		IDataUtil.put(idc, "isObjectString", isObjectString);
		idc.destroy();
		// --- <<IS-END>> ---

                
	}



	public static final void isStringInStringList (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(isStringInStringList)>> ---
		// @sigtype java 3.5
		// [i] field:0:required inString
		// [i] field:1:required inStringList
		// [o] field:0:required stringInStringList
		IDataCursor idc = pipeline.getCursor();
		String inString = IDataUtil.getString(idc,"inString");
		String[] inStringList = IDataUtil.getStringArray(idc, "inStringList" );
		boolean isInStringList;
		if (inStringList == null)
		{
			isInStringList = false;
		}
		else
		{
			ArrayList<String> inStringArray = new ArrayList<String>(Arrays.asList(inStringList));
			isInStringList = inStringArray.contains(inString);
		}
		IDataUtil.put(idc, "stringInStringList", String.valueOf(isInStringList));
		idc.destroy();
		// --- <<IS-END>> ---

                
	}



	public static final void removeDuplicateStringFromStringList (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(removeDuplicateStringFromStringList)>> ---
		// @sigtype java 3.5
		// [i] field:1:required inStringList
		// [o] field:1:required outStringList
		IDataCursor idc = pipeline.getCursor();
		String[] inStringList = IDataUtil.getStringArray(idc, "inStringList" );
		
		// Use a LinkedHashSet to preserve the order of elements
		Set<String> set = new LinkedHashSet<>(Arrays.asList(inStringList));
		// Convert the set back to an array
		String[] outStringList = set.toArray(new String[0]);
		
		IDataUtil.put(idc, "outStringList", outStringList);
		idc.destroy();
			
		// --- <<IS-END>> ---

                
	}
}

