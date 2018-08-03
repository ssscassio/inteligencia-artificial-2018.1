/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package caldeiraodofuzzy;

import static java.lang.Thread.sleep;
import net.sourceforge.jFuzzyLogic.FIS;
import net.sourceforge.jFuzzyLogic.plot.JFuzzyChart;
import net.sourceforge.jFuzzyLogic.rule.Variable;

/**
 *
 * @author aluno
 */
public class CaldeiraoDoFuzzy {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws InterruptedException {
         // Load from 'FCL' file
        String fileName = "fcl/tipper.fcl";
        FIS fis = FIS.load(fileName,true);

        // Error while loading?
        if( fis == null ) { 
            System.err.println("Can't load file: '" + fileName + "'");
            return;
        }

        // Show 
        JFuzzyChart.get().chart(fis);

        // Set inputs
        fis.setVariable("diff_temp", -10);
        fis.setVariable("diff_vazao", 0.1);

        // Evaluate
        fis.evaluate();

        // Show output variable's chart
        Variable out_hot = fis.getVariable("out_hot");
        JFuzzyChart.get().chart(out_hot, out_hot.getDefuzzifier(), true);
        
        Variable out_cold = fis.getVariable("out_hot");
        JFuzzyChart.get().chart(out_cold, out_cold.getDefuzzifier(), true);

        // Print ruleSet
        System.out.println(out_hot);
        System.out.println(out_cold);
     
//        Caldeira c = new Caldeira(1, 30);
//        for(int i = 0 ; i <= 2 ; i ++){
//            c.simular(0, 1);
//            System.out.println("DIFF TEMPERATURA = " + c.diff_temperatura());
//            System.out.println("VAZÃO = " + c.vazao());
//            sleep(1000);
//        }

    }
    
}
