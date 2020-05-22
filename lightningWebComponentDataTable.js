import { LightningElement, wire, track, api } from 'lwc'
import getAssignments from '@salesforce/apex/LWCDataTableController.getContacts'

// datatable columns with row actions
const columns = [
  {
    label: 'FirstName',
    fieldName: 'FirstName',
    sortable: 'true'
  },
  {
    label: 'LastName',
    fieldName: 'LastName',
    sortable: 'true'
  },
  {
    label: 'Phone',
    fieldName: 'Phone',
    type: 'phone',
    sortable: 'true'
  },
  {
    label: 'Email',
    fieldName: 'Email',
    type: 'email'
  }
]

export default class DspPastOptimizationPage extends LightningElement {
  // reactive variable
  @track contacts
  @track columns = columns
  @track sortBy
  @track sortDirection
  @api recordId

  // retrieving the data using wire service
  @wire(getContacts, { advertiserId: '$recordId' })
  wireAllcontacts ({ error, data }) {
    if (data) {
      this.contacts = data
      this.error = undefined
    } else if (error) {
      this.error = error
      this.contacts = undefined
    }
  }

  handleSortdata (event) {
    // field name
    this.sortBy = event.detail.fieldName
    // sort direction
    this.sortDirection = event.detail.sortDirection

    // calling sortdata function to sort the data based on direction and selected field
    this.sortData(event.detail.fieldName, event.detail.sortDirection)
  }

  sortData (fieldname, direction) {
    // serialize the data before calling sort function
    let parseData = JSON.parse(JSON.stringify(this.contacts))

    // Return the value stored in the field
    let keyValue = a => {
      return a[fieldname]
    }

    // cheking reverse direction
    let isReverse = direction === 'asc' ? 1 : -1

    // sorting data
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : '' // handling null values
      y = keyValue(y) ? keyValue(y) : ''

      // sorting values based on direction
      return isReverse * ((x > y) - (y > x))
    })
    // set the sorted data to data table data
    this.contacts = parseData
  }
}
