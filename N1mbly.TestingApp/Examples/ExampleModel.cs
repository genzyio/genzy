using System;
using System.Collections.Generic;

namespace N1mbly.Examples
{
    public class NestedModel2
    {
        public string First { get; set; }
        public string Second { get; set; }
        public double Third { get; set; }
        public float Fourth { get; set; }
        public List<string> EndString { get; set; }
    }

    public class NestedModel1
    {
        public string First { get; set; }
        public string Second { get; set; }
        public char Third { get; set; }
        public NestedModel2 NestedModel2 { get; set; }
    }

    public class ExampleModel
    {
        public DateTime Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
        public string Summary { get; set; }
        public NestedModel1 NestedModel1 { get; set; }

        public string GetName()
        {
            return "ExampleModel Name Value";
        }
    }
}
