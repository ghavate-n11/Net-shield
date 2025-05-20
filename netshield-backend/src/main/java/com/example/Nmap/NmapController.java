package com.example.Nmap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NmapController {

    private final NmapService nmapService = new NmapService();

    @GetMapping("/scan")
    public String scan(@RequestParam String target) {
        return nmapService.runNmapScan(target);
    }
}
