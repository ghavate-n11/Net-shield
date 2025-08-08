
package PacketLogPageController;

import com.netshield.entity.PacketLog;
import com.netshield.service.PacketLogService; // Import your service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;// Import model
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller //controller
public class PacketLogPageController {

    @Autowired
    private PacketLogService packetLogService; // Inject the service

    @GetMapping("/PacketLog")
    public String showPacketLogPage(Model model) {
        List<PacketLog> logs = packetLogService.getAllLogs(); // Fetch data from service
        model.addAttribute("logs", logs);                     // Pass data to HTML
        return "packetlog";                                   // Render the packetlog.html view
    }
}
